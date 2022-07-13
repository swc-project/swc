// @noImplicitReferences: true
// @currentDirectory: /
// @allowJs: true
// @maxNodeModuleJsDepth: 1
// Same as untypedModuleImport.ts but with --allowJs, so the package will actually be typed.
// @filename: /node_modules/foo/index.js
// @filename: /a.ts
import foo from "foo";
exports.default = {
    bar () {
        return 0;
    }
};
foo.bar();
