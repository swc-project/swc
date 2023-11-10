//// [npm.js]
var npm = module.exports = function(tree) {};
module.exports.asReadInstalled = function(tree) {
    npm(tree), module.exports(tree);
};
