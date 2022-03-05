import * as swcHelpers from "@swc/helpers";
var ExportedThing = function() {
    "use strict";
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
    "use strict";
    swcHelpers.classCallCheck(this, LocalThing), this.y = "ok";
};
