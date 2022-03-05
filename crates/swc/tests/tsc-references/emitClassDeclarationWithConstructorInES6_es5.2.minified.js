import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A(x) {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, [
        {
            key: "foo",
            value: function() {}
        }
    ]), A;
}(), B = function() {
    "use strict";
    function B(x) {
        arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        for(var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)args[_key - 2] = arguments[_key];
        swcHelpers.classCallCheck(this, B), this.x = "hello", this.y = 10;
    }
    return swcHelpers.createClass(B, [
        {
            key: "baz",
            value: function(z, v) {
                return this._bar;
            }
        }
    ]), B;
}();
