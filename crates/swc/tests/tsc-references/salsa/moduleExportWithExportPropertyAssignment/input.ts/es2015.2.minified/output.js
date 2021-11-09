module.exports = function() {
}, module.exports.f = function(a) {
};
var mod1 = require("./mod1");
mod1(), mod1.f() // error, not enough arguments
;
