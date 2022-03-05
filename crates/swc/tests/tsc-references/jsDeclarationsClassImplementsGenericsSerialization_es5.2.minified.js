import * as swcHelpers from "@swc/helpers";
export var Encoder = function() {
    "use strict";
    function Encoder() {
        swcHelpers.classCallCheck(this, Encoder);
    }
    return swcHelpers.createClass(Encoder, [
        {
            key: "encode",
            value: function(value) {
                return new Uint8Array(0);
            }
        }
    ]), Encoder;
}();
