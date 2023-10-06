// Copied from several files in node's source code.
// https://github.com/nodejs/node/blob/2d5d77306f6dff9110c1f77fefab25f973415770/lib/internal/modules/cjs/loader.js
// Each function and variable below must have a comment linking to the source in node's github repo.

const path = require('path');
const packageJsonReader = require('./node-package-json-reader');
const {JSONParse} = require('./node-primordials');
const {normalizeSlashes} = require('../dist/util');

module.exports.assertScriptCanLoadAsCJSImpl = assertScriptCanLoadAsCJSImpl;

/**
 * copied from Module._extensions['.js']
 * https://github.com/nodejs/node/blob/v15.3.0/lib/internal/modules/cjs/loader.js#L1113-L1120
 * @param {import('../src/index').Service} service
 * @param {NodeJS.Module} module
 * @param {string} filename
 */
function assertScriptCanLoadAsCJSImpl(service, module, filename) {
  const pkg = readPackageScope(filename);

  // ts-node modification: allow our configuration to override
  const tsNodeClassification = service.moduleTypeClassifier.classifyModule(normalizeSlashes(filename));
  if(tsNodeClassification.moduleType === 'cjs') return;

  // Function require shouldn't be used in ES modules.
  if (tsNodeClassification.moduleType === 'esm' || (pkg && pkg.data && pkg.data.type === 'module')) {
    const parentPath = module.parent && module.parent.filename;
    const packageJsonPath = pkg ? path.resolve(pkg.path, 'package.json') : null;
    throw createErrRequireEsm(filename, parentPath, packageJsonPath);
  }
}

// Copied from https://github.com/nodejs/node/blob/2d5d77306f6dff9110c1f77fefab25f973415770/lib/internal/modules/cjs/loader.js#L285-L301
function readPackageScope(checkPath) {
  const rootSeparatorIndex = checkPath.indexOf(path.sep);
  let separatorIndex;
  while (
    (separatorIndex = checkPath.lastIndexOf(path.sep)) > rootSeparatorIndex
  ) {
    checkPath = checkPath.slice(0, separatorIndex);
    if (checkPath.endsWith(path.sep + 'node_modules'))
      return false;
    const pjson = readPackage(checkPath);
    if (pjson) return {
      path: checkPath,
      data: pjson
    };
  }
  return false;
}

// Copied from https://github.com/nodejs/node/blob/2d5d77306f6dff9110c1f77fefab25f973415770/lib/internal/modules/cjs/loader.js#L249
const packageJsonCache = new Map();

// Copied from https://github.com/nodejs/node/blob/v15.3.0/lib/internal/modules/cjs/loader.js#L275-L304
function readPackage(requestPath) {
  const jsonPath = path.resolve(requestPath, 'package.json');

  const existing = packageJsonCache.get(jsonPath);
  if (existing !== undefined) return existing;

  const result = packageJsonReader.read(jsonPath);
  const json = result.containsKeys === false ? '{}' : result.string;
  if (json === undefined) {
    packageJsonCache.set(jsonPath, false);
    return false;
  }

  try {
    const parsed = JSONParse(json);
    const filtered = {
      name: parsed.name,
      main: parsed.main,
      exports: parsed.exports,
      imports: parsed.imports,
      type: parsed.type
    };
    packageJsonCache.set(jsonPath, filtered);
    return filtered;
  } catch (e) {
    e.path = jsonPath;
    e.message = 'Error parsing ' + jsonPath + ': ' + e.message;
    throw e;
  }
}

// Native ERR_REQUIRE_ESM Error is declared here:
//   https://github.com/nodejs/node/blob/2d5d77306f6dff9110c1f77fefab25f973415770/lib/internal/errors.js#L1294-L1313
// Error class factory is implemented here:
//   function E: https://github.com/nodejs/node/blob/2d5d77306f6dff9110c1f77fefab25f973415770/lib/internal/errors.js#L323-L341
//   function makeNodeErrorWithCode: https://github.com/nodejs/node/blob/2d5d77306f6dff9110c1f77fefab25f973415770/lib/internal/errors.js#L251-L278
// The code below should create an error that matches the native error as closely as possible.
// Third-party libraries which attempt to catch the native ERR_REQUIRE_ESM should recognize our imitation error.
function createErrRequireEsm(filename, parentPath, packageJsonPath) {
  const code = 'ERR_REQUIRE_ESM'
  const err = new Error(getMessage(filename, parentPath, packageJsonPath))
  // Set `name` to be used in stack trace, generate stack trace with that name baked in, then re-declare the `name` field.
  // This trick is copied from node's source.
  err.name = `Error [${ code }]`
  err.stack
  Object.defineProperty(err, 'name', {
    value: 'Error',
    enumerable: false,
    writable: true,
    configurable: true
  })
  err.code = code
  return err

  // Copy-pasted from https://github.com/nodejs/node/blob/b533fb3508009e5f567cc776daba8fbf665386a6/lib/internal/errors.js#L1293-L1311
  // so that our error message is identical to the native message.
  function getMessage(filename, parentPath = null, packageJsonPath = null) {
    const ext = path.extname(filename)
    let msg = `Must use import to load ES Module: ${filename}`;
    if (parentPath && packageJsonPath) {
      const path = require('path');
      const basename = path.basename(filename) === path.basename(parentPath) ?
        filename : path.basename(filename);
      msg +=
        '\nrequire() of ES modules is not supported.\nrequire() of ' +
        `${filename} ${parentPath ? `from ${parentPath} ` : ''}` +
        `is an ES module file as it is a ${ext} file whose nearest parent ` +
        `package.json contains "type": "module" which defines all ${ext} ` +
        'files in that package scope as ES modules.\nInstead ' +
        'change the requiring code to use ' +
        'import(), or remove "type": "module" from ' +
        `${packageJsonPath}.\n`;
      return msg;
    }
    return msg;
  }
}
