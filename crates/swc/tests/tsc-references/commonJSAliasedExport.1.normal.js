//// [commonJSAliasedExport.js]
var donkey = function(ast) {
    return ast;
};
function funky(declaration) {
    return false;
}
module.exports = donkey;
module.exports.funky = funky;
//// [bug43713.js]
var funky = require('./commonJSAliasedExport').funky;
/** @type {boolean} */ var diddy;
var diddy = funky(1);
