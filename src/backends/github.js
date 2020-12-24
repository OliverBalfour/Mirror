
/**
 * GitHub Gist backend for synchronisation between clients
 *
 * Any discrepancies in the exported functions are due to API
 * limitations
 */

import { standaloneNamespaces, shallowNamespaces, EditSet } from './';
import * as idb from './indexeddb';

// GitHub API client dynamic import
const getOctokit = () => import("@octokit/rest").then(({ Octokit }) =>
  new Octokit({
    auth: config.token,
  })
);

export const config = {
  sha: {
    get latest() { return localStorage['__GITHUB_GIST_LATEST_SHA']; },
    set latest(x) { localStorage['__GITHUB_GIST_LATEST_SHA'] = x; },
    get current() { return localStorage['__GITHUB_GIST_CURRENT_SHA']; },
    set current(x) { localStorage['__GITHUB_GIST_CURRENT_SHA'] = x; },
  },
  // This is fairly insecure, especially given there are possible XSS vulnerabilities
  // See https://stackoverflow.com/a/58467408/4642943 for alternatives
  // once security becomes a bigger concern.
  get token() { return localStorage['__GITHUB_TOKEN']; },
  set token(x) { localStorage['__GITHUB_TOKEN'] = x; },
  get username() { return localStorage['__GITHUB_USERNAME']; },
  set username(x) { localStorage['__GITHUB_USERNAME'] = x; },
  get gist_id() { return localStorage['__GITHUB_GIST_ID']; },
  set gist_id(x) { localStorage['__GITHUB_GIST_ID'] = x; },
};

export function loggedIn () {
  return Boolean(config.token);
}

export async function commit (editSet) {
  if (editSet.set.length === 0) return [];
  // If this fails it is due to authentication failure
  // TODO: handle this case in a user-friendly way
  const gh = await getOctokit();
  const update = set =>
    gh.gists.update({
      gist_id: config.gist_id,
      description: "Mirror synchronisation (https://oliverbalfour.github.io/Mirror/)",
      files: compileEditSet(set)
    });
  // If one of the actions failed, the whole request fails
  // To minimise collateral damage we repeat each action individually
  await update(editSet).catch(async e => {
    console.error(e);
    return await Promise.all(
      editSet.set.map(edit => update({ set: [edit] }))
    ).catch(console.error)
  });
  await updateLatestSHA();
}

function compileEditSet (editSet) {
  // Produces the file modifications object
  // https://developer.github.com/v3/gists/#update-a-gist
  const files = {};
  for (let edit of editSet.set) {
    const filename = getEditFilename(edit);
    switch (edit.type) {
      case 'delete':
        files[filename] = null;
        break;
      case 'add':
      case 'edit':
      {
        const content = serializeObject(edit.object);
        files[filename] = { filename, content };
        break;
      }
      case 'param':
        files[filename] = { filename, content: JSON.stringify(edit.value) }
        break;
      default:
    }
  }
  return files;
}

function getEditFilename (edit) {
  return getFilename(edit.namespace, edit.object ? edit.object.id : null);
}
function getFilename (namespace, id = null) {
  if (namespace === 'cards')
    return `${id}.md`;
  else if (id)
    return `${namespace}.${id}.md`;
  else
    return `${namespace}.md`;
}

function getObjectPath (filename) {
  const parts = filename.split('.');
  if (parts.length === 2) {
    if (standaloneNamespaces.indexOf(parts[0]) === -1) {
      return ['cards', parts[0]];
    } else {
      return [parts[0]];
    }
  } else {
    return [parts[0], parts[1]];
  }
}

function serializeObject (object) {
  // Cards are serialized to markdown with YAML frontmatter
  // where the values are JSON serialized
  // Columns and tabs contain just the frontmatter component
  const specialKeys = ['description'];
  let frontmatter = [];
  for (let key in object) {
    if (specialKeys.indexOf(key) === -1) {
      frontmatter.push(`${key}: ${JSON.stringify(object[key])}`);
    }
  }
  let serialized = `---\n${frontmatter}\n---\n`;
  if (object.description) serialized += object.description;
  return serialized;
}

function deserializeObject (markdown) {
  const object = {};
  const [ , frontmatter, description] = markdown.split('---');
  frontmatter.split('\n').filter(str => str.trim().length).forEach(str => {
    const [key, leftPaddedValue] = str.split(':');
    // Need to be careful with these objects; if someone edits a GitHub Gist
    // file to include "hasOwnProperty: 0" it could cause a crash
    object[key] = JSON.parse(leftPaddedValue.trimStart());
  });
  if (description.trim().length)
    object.description = description.trim();
  return object;
}

// Call when first logged in
// This will update the IndexedDB cache/GitHub Gist
// and return a state object asynchronously
export async function postLogIn () {
  // If there is a file called `__logged_in` then the gist has been used
  // on another computer and so the remote state is used to patch local state.
  // If the file does not exist, we patch the remote state with the local.
  // Patch meaning write one state over another without deleting existing state,
  // that is not overwritten.

    // SHA must be set prior to calling `get`
  config.sha.current = config.sha.latest = await getLatestSHA();
  const hasLoggedInBefore = (await get('__logged_in', false)).status !== 404;

  if (hasLoggedInBefore) {
    return synchroniseState();
  } else {
    await set('__logged_in', 'true');
    // Updates SHAs
    await saveState(await idb.loadState());
    return {};
  }
}

// Call on app initialisation and periodically thereafter
export const synchroniseState = async () => {
  config.sha.latest = await getLatestSHA();
  const files = await getAllModifiedFiles();
  const diff = getDiffObject(files);
  await idb.saveState(diff);
  config.sha.current = config.sha.latest;
  return diff;
}

// Save initial state, or save state after logging in
export const saveState = async state => {
  const set = new EditSet();
  for (let namespace of standaloneNamespaces) {
    set.param(namespace, state[namespace], null);
  }
  for (let namespace of shallowNamespaces) {
    for (let id in state[namespace]) {
      set.add(namespace, state[namespace][id]);
    }
  }
  // commit(set) rather than set.commit() as we don't want to
  // touch the undo stack
  commit(set);
};

async function get (filename, deserialize = true) {
  // There is an undocumented endpoint for accessing raw files here:
  // https://gist.githubusercontent.com/:user/:id/raw/:sha/:filename
  const endpoint = "https://gist.githubusercontent.com/"
  + `${config.username}/${config.gist_id}/raw/${config.sha.latest}/${filename}`;
  const res = await fetch(endpoint);
  if (deserialize)
    return deserializeObject(res.text());
  else
    return res;
}

// Warning: this will change the remote latest commit SHA
// but not update it locally. Call updateLatestSHA if needed.
async function set (filename, content) {
  const files = { [filename]: { filename, content } };
  const gh = await getOctokit();
  await gh.gists.update({
    gist_id: config.gist_id,
    files
  });
}

export async function load (namespace, id = null) {
  try {
    return await get(getFilename(namespace, id));
  } catch (e) {
    return null;
  }
}

export async function getLatestSHA () {
  const gh = await getOctokit();
  const commits = await gh.gists.listCommits({ gist_id: config.gist_id, per_page: 1 });
  return commits.data[0].version;
}

async function updateLatestSHA () {
  // Sets the latest and current SHAs to the latest SHA on the remote
  // Use with caution; only for internal use
  config.sha.current = config.sha.latest = await getLatestSHA();
}

// Returns a list of commits in order of newest to oldest since the last known commit
export async function getNewCommitSHAs () {
  const gh = await getOctokit();
  const SHA = config.sha.current;
  const SHAs = [];
  let page_no = 1;
  while (page_no < 100) {
    const commits = (await gh.gists.listCommits({
      gist_id: config.gist_id,
      per_page: 100,
      page: page_no,
    })).data;
    if (commits.length === 0) break;
    for (let commit of commits) {
      const { version } = commit;
      if (SHA === version) break;
      SHAs.push(version);
    }
    page_no++;
  }
  return SHAs;
}

async function getGistRevision (sha) {
  // https://api.github.com/gists/:id/:sha has a files field
  const gh = await getOctokit();
  const response = await gh.gists.getRevision({
    gist_id: config.gist_id,
    sha
  });
  // Returns a dict where filenames are the keys, and the values are objects
  // with a "content" field
  return response.data.files;
}

// Returns a dict with key = filename, value = contents
// Assumes no truncation, does not handle errors
async function getAllModifiedFiles () {
  const SHAs = await getNewCommitSHAs();
  const files = {};
  let i = SHAs.length;
  while (i --> 0) {
    const revision = getGistRevision(SHAs[i]);
    for (let file in revision) {
      files[file] = revision[file].content;
    }
  }
  return files;
}

async function getDiffObject (files) {
  const diff = {};
  for (let filename in files) {
    const path = getObjectPath(filename);
    let ptr = diff;
    for (let layer of path) {
      ptr[layer] = ptr[layer] || {};
      ptr = ptr[layer];
    }
    ptr[path[path.length - 1]] = files[filename];
  }
  return diff;
}
