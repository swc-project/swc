exports.codes = {
  ERR_INPUT_TYPE_NOT_ALLOWED: createErrorCtor(joinArgs('ERR_INPUT_TYPE_NOT_ALLOWED')),
  ERR_INVALID_ARG_VALUE: createErrorCtor(joinArgs('ERR_INVALID_ARG_VALUE')),
  ERR_INVALID_MODULE_SPECIFIER: createErrorCtor(joinArgs('ERR_INVALID_MODULE_SPECIFIER')),
  ERR_INVALID_PACKAGE_CONFIG: createErrorCtor(joinArgs('ERR_INVALID_PACKAGE_CONFIG')),
  ERR_INVALID_PACKAGE_TARGET: createErrorCtor(joinArgs('ERR_INVALID_PACKAGE_TARGET')),
  ERR_MANIFEST_DEPENDENCY_MISSING: createErrorCtor(joinArgs('ERR_MANIFEST_DEPENDENCY_MISSING')),
  ERR_MODULE_NOT_FOUND: createErrorCtor((path, base, type = 'package') => {
    return `Cannot find ${type} '${path}' imported from ${base}`
  }),
  ERR_PACKAGE_IMPORT_NOT_DEFINED: createErrorCtor(joinArgs('ERR_PACKAGE_IMPORT_NOT_DEFINED')),
  ERR_PACKAGE_PATH_NOT_EXPORTED: createErrorCtor(joinArgs('ERR_PACKAGE_PATH_NOT_EXPORTED')),
  ERR_UNSUPPORTED_DIR_IMPORT: createErrorCtor(joinArgs('ERR_UNSUPPORTED_DIR_IMPORT')),
  ERR_UNSUPPORTED_ESM_URL_SCHEME: createErrorCtor(joinArgs('ERR_UNSUPPORTED_ESM_URL_SCHEME')),
  ERR_UNKNOWN_FILE_EXTENSION: createErrorCtor(joinArgs('ERR_UNKNOWN_FILE_EXTENSION')),
}

function joinArgs(name) {
  return (...args) => {
    return [name, ...args].join(' ')
  }
}

function createErrorCtor(errorMessageCreator) {
  return class CustomError extends Error {
    constructor(...args) {
      super(errorMessageCreator(...args))
    }
  }
}
