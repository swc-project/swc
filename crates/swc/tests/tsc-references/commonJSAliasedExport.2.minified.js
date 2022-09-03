//// [commonJSAliasedExport.js]
var donkey = function(ast) {
    return ast;
};
function funky(declaration) {
    return !1;
}
module.exports = donkey, module.exports.funky = funky;
//// [bug43713.js]
var diddy, funky = require("./commonJSAliasedExport").funky, diddy = funky(1);
