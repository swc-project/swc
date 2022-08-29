//// [untypedModuleImport_allowJs.ts]
// Same as untypedModuleImport.ts but with --allowJs, so the package will actually be typed.
//// [/node_modules/foo/index.js]
exports.default = {
    bar: function bar() {
        return 0;
    }
};
//// [/a.ts]
import foo from "foo";
foo.bar();
