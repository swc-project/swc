function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var ExportedThing = function() {
    "use strict";
    _classCallCheck(this, ExportedThing), this.z = "ok";
};
module.exports = {
    doTheThing: function(x) {
        return {
            x: "" + x
        };
    },
    ExportedThing: ExportedThing
};
var LocalThing = function() {
    "use strict";
    _classCallCheck(this, LocalThing), this.y = "ok";
};
export { };
