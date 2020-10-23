
const getOctokit = () => import("@octokit/rest").then(({ Octokit }) =>
  new Octokit({
    auth: localStorage["__GITHUB_TOKEN"],
  })
);

// TODO: does this need to be a class, or can it be a couple exported functions?
// TODO: keep track of the latest SHA revision, perhaps in localStorage
// TODO: write code to load all revisions since last known revision and transmit them to IndexedDB
// TODO: support rectifying divergent branches (via fast forward or interactive merge dialog for conflicts)
// TODO: initialisation of newly logged in client

export async function commit (editSet) {
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
    );
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
      case 'edit': {
        const content = serializeObject(edit.object);
        files[filename] = { filename, content };
        break;
      }
      default:
    }
  }
  return files;
}

function getEditFilename (edit) {
  if (edit.namespace === 'cards')
    return edit.id + '.md';
  else
    return edit.namespace + '.' + edit.id + '.md';
}

function serializeObject (object) {
  // Cards are serialized to markdown with YAML frontmatter
  // where the values are JSON serialized
  // Columns and tabs contain just the frontmatter component
  const specialKeys = ['description'];
  let frontmatter = [];
  for (let key of object) {
    if (specialKeys.indexOf(key) === -1) {
      frontmatter.push(`${key}: ${JSON.stringify(object[key])}`);
    }
  }
  let serialized = `---\n${frontmatter}\n---\n`;
  if (object.description) serialized += object.description;
  return serialized;
}

// TODO: deserializeObject

const initialiseGitHubClient = () => {
  // const set = new EditSet();
  // set.edit('cards', "main", { description: "The EditSet and BackendGitHub::commit code works", id: 'main' });
  // set.add('cards', "test", { description: "hi there", id: 'test' });
  // commit(set).then(async () => await backend.commit(new EditSet().delete('cards', "test"))).catch(console.error);
}

window.__GHLoggedIn = initialiseGitHubClient;

if (localStorage["__GITHUB_TOKEN"]) {
  window.__GHLoggedIn();
}
