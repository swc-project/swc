module.exports = 1, module.exports.f = function() {
};
var mod1 = require("./mod1");
mod1.toFixed(12), mod1.f() // error, 'f' is not a property on 'number'
;
