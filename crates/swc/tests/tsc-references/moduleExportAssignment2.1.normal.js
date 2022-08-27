//// [npm.js]
var npm = module.exports = function npm(tree) {};
module.exports.asReadInstalled = function(tree) {
    npm(tree) // both references should be callable
    ;
    module.exports(tree);
};
