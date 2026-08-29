module.exports = async function beforeAdd(git) {
  try {
    await git.rm('.gitattributes')
  } catch {
    // A fresh Pages branch may not contain repository attributes yet.
  }
}
