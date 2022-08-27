//// [commonJSAliasedExport.js]
var donkey = function(ast) {
    return ast;
};
function funky(declaration) {
    return !1;
}
module.exports = donkey, module.exports.funky = funky;
//// [bug43713.js]
(0, require("./commonJSAliasedExport").funky)(1);
