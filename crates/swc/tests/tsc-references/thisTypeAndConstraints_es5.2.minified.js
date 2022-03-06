import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, [
        {
            key: "self",
            value: function() {
                return this;
            }
        }
    ]), A;
}(), B = function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    return swcHelpers.createClass(B, [
        {
            key: "foo",
            value: function(x) {
                x = x.self();
            }
        },
        {
            key: "bar",
            value: function(x) {
                x = x.self();
            }
        }
    ]), B;
}();
