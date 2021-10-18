module.exports = Test;
var foo = require("foo"), relMod = require("./sub/relMod");
foo.M2.x && new relMod(require("./other").M2.x.charCodeAt(0));
export { };
