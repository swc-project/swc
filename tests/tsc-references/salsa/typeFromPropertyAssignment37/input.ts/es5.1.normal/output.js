// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: mod.js
var util = exports = module.exports = {
};
if (!!false) {
    util.existy = function() {
    };
}
// @Filename: use.js
var util = require('./mod');
function n() {
    util.existy // no error
    ;
}
util.existy // no error
;
