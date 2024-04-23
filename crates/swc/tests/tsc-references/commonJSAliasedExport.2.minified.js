//// [commonJSAliasedExport.js]
module.exports = function(ast) {
    return ast;
}, module.exports.funky = function(declaration) {
    return !1;
};
//// [bug43713.js]
(0, require('./commonJSAliasedExport').funky)(1);
