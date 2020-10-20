
import { BackendBase, EditSet } from './base';

const getOctokit = () => import("@octokit/rest").then(({ Octokit }) =>
  new Octokit({
    auth: localStorage["__GITHUB_TOKEN"],
  })
);

// TODO: does this need to be a class, or can it be a couple exported functions?
// There's minimal state it needs to keep track of

// TODO: keep track of the latest SHA revision, perhaps in localStorage
// TODO: write code to load all revisions since last known revision and transmit
// them to IndexedDB

// TODO: how do we access an individual file in the Gist?

export class BackendGitHub extends BackendBase {
  compileEditSet (editSet) {
    // Produces the file modifications object
    // https://developer.github.com/v3/gists/#update-a-gist
    const files = {};
    for (let edit of editSet.set) {
      const filename = edit.node + '.md';
      switch (edit.type) {
        case 'delete':
          files[filename] = null;
          break;
        case 'add':
        case 'edit': {
          // Gists cannot have empty files
          const content = edit.content.length ? edit.content : ' ';
          files[filename] = { filename, content };
          break;
        }
        default:
      }
    }
    return files;
  }
  async commit (editSet) {
    const update = async (gh, set) =>
      await gh.gists.update({
        gist_id: localStorage["__GITHUB_GIST_ID"],
        description: "Mirror synchronisation (https://oliverbalfour.github.io/Mirror/)",
        files: this.compileEditSet(set)
      });
    // If one of the actions failed, the whole request fails
    // To minimise collateral damage we repeat each action individually
    return getOctokit()
      .then(async gh =>
        await update(gh, editSet).catch(async e =>
          await Promise.all(editSet.set.map(edit => update(gh, { set: [edit] })))
            .catch(console.error)
        )
      );
  }
}

const initialiseGitHubClient = () => {
  // const backend = new BackendGitHub();
  // const set = new EditSet();
  // set.edit("main", "The EditSet and BackendGitHub::commit code works");
  // set.add("test", "hi there");
  // backend.commit(set).then(async () => await backend.commit(new EditSet().delete("test"))).catch(console.error);
}

window.__GHLoggedIn = initialiseGitHubClient;

if (localStorage["__GITHUB_TOKEN"]) {
  window.__GHLoggedIn();
}
