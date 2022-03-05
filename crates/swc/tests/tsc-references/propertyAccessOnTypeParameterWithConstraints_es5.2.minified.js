import * as swcHelpers from "@swc/helpers";
var i, a, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "f",
            value: function() {
                var x;
                return x.getDate() + x.getDate();
            }
        }
    ]), C;
}();
new C().f(), i.foo.getDate(), i.foo.getDate(), a().getDate(), a().getDate(), ({
    foo: function(x) {
        return x.getDate() + x.getDate();
    }
}).foo(new Date());
