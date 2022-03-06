import * as swcHelpers from "@swc/helpers";
var C = // no errors expected
/*#__PURE__*/ function() {
    "use strict";
    function C(x) {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x1) {
        var bar = function bar(x) {
            return x;
        };
        return bar;
    };
    return C;
}();
var c = new C({
    length: 2
});
var r = c.foo({
    length: 3,
    charAt: function(x) {
        '';
    }
});
var r2 = r('');
