const fs = require('fs');

// In node's core, this is implemented in C
// https://github.com/nodejs/node/blob/v15.3.0/src/node_file.cc#L891-L985
function internalModuleReadJSON(path) {
  let string
  try {
    string = fs.readFileSync(path, 'utf8')
  } catch (e) {
    if (e.code === 'ENOENT') return []
    throw e
  }
  // Node's implementation checks for the presence of relevant keys: main, name, type, exports, imports
  // Node does this for performance to skip unnecessary parsing.
  // This would slow us down and, based on our usage, we can skip it.
  const containsKeys = true
  return [string, containsKeys]
}

module.exports = {
  internalModuleReadJSON
};
