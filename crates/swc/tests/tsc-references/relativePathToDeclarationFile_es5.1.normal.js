// @ModuleResolution: classic
// @Filename: test/foo.d.ts
export { };
// @Filename: test/other.d.ts
export { };
// @Filename: test/sub/relMod.d.ts
module.exports = Test;
export { };
// @Filename: test/file1.ts
var foo = require("foo");
var other = require("./other");
var relMod = require("./sub/relMod");
if (foo.M2.x) {
    var x = new relMod(other.M2.x.charCodeAt(0));
}
export { };
