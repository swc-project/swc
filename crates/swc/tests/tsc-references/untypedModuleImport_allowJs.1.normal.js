//// [untypedModuleImport_allowJs.ts]
//// [/node_modules/foo/index.js]
exports.default = {
    bar: function bar() {
        return 0;
    }
};
//// [/a.ts]
import foo from "foo";
foo.bar();
