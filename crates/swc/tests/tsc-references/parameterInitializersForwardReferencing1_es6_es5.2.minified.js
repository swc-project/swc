import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 12, y = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : x;
    swcHelpers.classCallCheck(this, Foo), this.x = x, this.y = y;
};
