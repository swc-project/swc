const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const { version } = require('../../package.json')
const platforms = require('./platforms')
const updatePackageJson = require('./update-package')

updatePackageJson(path.join(__dirname, '..', '..', 'package.json'), {
    optionalDependencies: platforms.reduce((acc, cur) => {
        acc[`@swc/core-${cur}`] = `^${version}`
        return acc
    }, {}),
})


for (const name of platforms) {
    const pkgDir = path.join(__dirname, `core-${name}`)
    updatePackageJson(path.join(pkgDir, 'package.json'), {
        version: `${version}`,
    })
}

for (const name of platforms) {
    const pkgDir = path.join(__dirname, `core-${name}`)
    const bindingFile = fs.readFileSync(path.join(__dirname, '..', '..', 'native', `node.${name}.node`))
    fs.writeFileSync(path.join(pkgDir, `swc.node`), bindingFile);

    execSync('npm publish --dry-run', {
        cwd: pkgDir,
        env: process.env,
        stdio: 'inherit',
    })
}