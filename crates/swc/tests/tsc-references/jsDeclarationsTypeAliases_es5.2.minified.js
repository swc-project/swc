import * as swcHelpers from "@swc/helpers";
var ExportedThing = function() {
    swcHelpers.classCallCheck(this, ExportedThing), this.z = "ok";
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
    swcHelpers.classCallCheck(this, LocalThing), this.y = "ok";
};
