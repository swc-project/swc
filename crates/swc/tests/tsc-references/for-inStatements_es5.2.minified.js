import * as swcHelpers from "@swc/helpers";
for(aString in {});
for(anAny in {});
for(var x in {});
for(var x in []);
for(var x in [
    1,
    2,
    3,
    4,
    5
]);
function fn() {}
for(var x in fn());
for(var x in /[a-z]/);
for(var x in new Date());
for(var x in c || d);
for(var x in e ? c : d);
for(var x in c);
for(var x in d);
for(var x in d[x]);
for(var x in c[d]);
for(var x in function(x1) {
    return x1;
});
for(var x in function(x2, y) {
    return x2 + y;
});
var aString, anAny, c, d, e, i, M, Color, A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, [
        {
            key: "biz",
            value: function() {
                for(var x in this.biz());
                for(var x in this.biz);
                for(var x in this);
                return null;
            }
        }
    ], [
        {
            key: "baz",
            value: function() {
                for(var x in this);
                for(var x in this.baz);
                for(var x in this.baz());
                return null;
            }
        }
    ]), A;
}(), B = function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(B, [
        {
            key: "boz",
            value: function() {
                for(var x in this.biz());
                for(var x in this.biz);
                for(var x in this);
                for(var x in swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "biz", this));
                for(var x in swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "biz", this).call(this));
                return null;
            }
        }
    ]), B;
}(A);
for(var x in i[42]);
for(var x in !function(M1) {
    var X = function() {
        "use strict";
        swcHelpers.classCallCheck(this, X);
    };
    M1.X = X;
}(M || (M = {})), M);
for(var x in M.X);
for(var x in !function(Color) {
    Color[Color.Red = 0] = "Red", Color[Color.Blue = 1] = "Blue";
}(Color || (Color = {})), Color);
for(var x in Color.Blue);
