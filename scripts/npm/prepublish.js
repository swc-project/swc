const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const { version } = require('../../package.json')
const platforms = require('./platforms')
const updatePackageJson = require('./update-package')

updatePackageJson(path.join(__dirname, '..', '..', 'package.json'), {
    optionalDependencies: platforms.reduce((acc, cur) => {
        acc[`@swc-node/core-${cur}`] = `^${version}`
        return acc
    }, {}),
})

for (const name of [...platforms, 'linux-musl']) {
    const pkgDir = path.join(__dirname, 'npm', `core-${name}`)
    const filename = `swc.${name}.node`
    const bindingFile = fs.readFileSync(path.join(__dirname, `bindings-${name}`, filename))
    fs.writeFileSync(path.join(pkgDir, filename), bindingFile)
    execSync('npm publish', {
        cwd: pkgDir,
        env: process.env,
        stdio: 'inherit',
    })
}