//// [mod.js]
var util = exports1 = module.exports = {};
if (!!false) {
    util.existy = function() {};
}
//// [use.js]
var util = require("./mod");
function n() {
    util.existy // no error
    ;
}
util.existy // no error
;
