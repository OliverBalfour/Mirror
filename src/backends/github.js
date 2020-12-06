
const getOctokit = () => import("@octokit/rest").then(({ Octokit }) =>
  new Octokit({
    auth: localStorage["__GITHUB_TOKEN"],
  })
);

// TODO: keep track of the latest SHA revision, perhaps in localStorage
// TODO: write code to load all revisions since last known revision and transmit them to IndexedDB
// TODO: support rectifying divergent branches (via fast forward or interactive merge dialog for conflicts)
// TODO: initialisation of newly logged in client

export async function commit (editSet) {
  if (editSet.set.length === 0) return [];
  const update = async (gh, set) =>
    await gh.gists.update({
      gist_id: localStorage["__GITHUB_GIST_ID"],
      description: "Mirror synchronisation (https://oliverbalfour.github.io/Mirror/)",
      files: compileEditSet(set)
    });
  // If one of the actions failed, the whole request fails
  // To minimise collateral damage we repeat each action individually
  return getOctokit()
    .then(async gh =>
      await update(gh, editSet).catch(async e => {
        console.error(e);
        return await Promise.all(editSet.set.map(edit => update(gh, { set: [edit] })))
          .catch(console.error)
      })
    ).catch(console.error);  // Authentication issue
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
  if (edit.namespace === 'cards')
    return edit.object.id + '.md';
  else if (edit.type === 'param')
    return edit.namespace + '.md';
  else
    return edit.namespace + '.' + edit.object.id + '.md';
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

const initialiseGitHubClient = () => {
  // TODO
  // Should ask whether we want to use the local version or pull the remote
  // This function should only be called once, not each reload
}

// TODO: remove
window.__GHLoggedIn = initialiseGitHubClient;
if (localStorage["__GITHUB_TOKEN"]) {
  window.__GHLoggedIn();
}
