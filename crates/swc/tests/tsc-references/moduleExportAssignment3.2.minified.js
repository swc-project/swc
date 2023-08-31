//// [mod.js]
module.exports = function() {}, module.exports() // should be callable
;
//// [npm.js]
require("./mod")() // should be callable from here too
;
