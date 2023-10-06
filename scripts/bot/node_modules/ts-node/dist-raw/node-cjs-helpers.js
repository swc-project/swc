const {ArrayPrototypeForEach, StringPrototypeStartsWith, ObjectPrototypeHasOwnProperty, StringPrototypeIncludes, ObjectDefineProperty} = require('./node-primordials');

exports.addBuiltinLibsToObject = addBuiltinLibsToObject;

// Copied from https://github.com/nodejs/node/blob/21f5a56914a3b24ad77535ef369b93c6b1c11d18/lib/internal/modules/cjs/helpers.js#L133-L178
function addBuiltinLibsToObject(object) {
  // Make built-in modules available directly (loaded lazily).
  const { builtinModules } = require('module').Module;
  ArrayPrototypeForEach(builtinModules, (name) => {
    // Neither add underscored modules, nor ones that contain slashes (e.g.,
    // 'fs/promises') or ones that are already defined.
    if (StringPrototypeStartsWith(name, '_') ||
        StringPrototypeIncludes(name, '/') ||
        ObjectPrototypeHasOwnProperty(object, name)) {
      return;
    }
    // Goals of this mechanism are:
    // - Lazy loading of built-in modules
    // - Having all built-in modules available as non-enumerable properties
    // - Allowing the user to re-assign these variables as if there were no
    //   pre-existing globals with the same name.

    const setReal = (val) => {
      // Deleting the property before re-assigning it disables the
      // getter/setter mechanism.
      delete object[name];
      object[name] = val;
    };

    ObjectDefineProperty(object, name, {
      get: () => {
        const lib = require(name);

        // Disable the current getter/setter and set up a new
        // non-enumerable property.
        delete object[name];
        ObjectDefineProperty(object, name, {
          get: () => lib,
          set: setReal,
          configurable: true,
          enumerable: false
        });

        return lib;
      },
      set: setReal,
      configurable: true,
      enumerable: false
    });
  });
}
