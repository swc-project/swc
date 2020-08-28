const fs = require('fs')

module.exports = function updatePackageJson(path, partial) {
    const old = require(path)
    fs.writeFileSync(path, JSON.stringify({ ...old, ...partial }, null, 2))
}