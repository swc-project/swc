var donkey = function(ast) {
    return ast;
};
function funky(declaration) {
    return !1;
}
module.exports = donkey, module.exports.funky = funky;
(0, require("./commonJSAliasedExport").funky)(1);
