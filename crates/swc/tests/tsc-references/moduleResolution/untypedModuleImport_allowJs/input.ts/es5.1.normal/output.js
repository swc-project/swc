// @filename: /a.ts
import foo from "foo";
// @noImplicitReferences: true
// @currentDirectory: /
// @allowJs: true
// @maxNodeModuleJsDepth: 1
// Same as untypedModuleImport.ts but with --allowJs, so the package will actually be typed.
// @filename: /node_modules/foo/index.js
exports.default = {
    bar: function() {
        return 0;
    }
};
foo.bar();
