function funky(declaration) {
    return !1;
}
module.exports = function(ast) {
    return ast;
}, module.exports.funky = funky;
var funky = require('./commonJSAliasedExport').funky;
funky(1);
