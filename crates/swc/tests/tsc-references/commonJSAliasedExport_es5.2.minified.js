var donkey = function(ast) {
    return ast;
};
function funky(declaration) {
    return !1;
}
module.exports = donkey, module.exports.funky = funky;
var funky = require("./commonJSAliasedExport").funky;
funky(1);
