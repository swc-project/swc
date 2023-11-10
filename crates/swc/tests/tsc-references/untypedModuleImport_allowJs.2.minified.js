//// [untypedModuleImport_allowJs.ts]
//// [/node_modules/foo/index.js]
exports.default = {
    bar: function() {
        return 0;
    }
};
//// [/a.ts]
import foo from "foo";
foo.bar();
