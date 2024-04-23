//// [mod.js]
var util = exports = module.exports = {};
if (!!false) {
    util.existy = function() {};
}
//// [use.js]
var util = require('./mod');
function n() {
    util.existy // no error
    ;
}
util.existy // no error
;
