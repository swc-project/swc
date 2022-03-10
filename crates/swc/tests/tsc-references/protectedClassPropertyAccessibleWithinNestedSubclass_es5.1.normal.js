import * as swcHelpers from "@swc/helpers";
// @target: ES5
var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    var _proto1 = C.prototype;
    _proto1.foo = function foo() {
        return this.x;
    };
    _proto1.bar = function bar() {
        var D = /*#__PURE__*/ function() {
            function D() {
                swcHelpers.classCallCheck(this, D);
            }
            var _proto = D.prototype;
            _proto.foo = function foo() {
                var c = new C();
                var c1 = c.y;
                var c2 = c.x;
                var c3 = c.foo;
                var c4 = c.bar;
                var c5 = c.z; // error
                var sc1 = C.x;
                var sc2 = C.y;
                var sc3 = C.foo;
                var sc4 = C.bar;
            };
            return D;
        }();
    };
    C.foo = function foo() {
        return this.x;
    };
    C.bar = function bar() {
        this.foo();
    };
    swcHelpers.createClass(C, [
        {
            key: "y",
            get: function get() {
                return this.x;
            },
            set: function set(x) {
                this.y = this.x;
            }
        }
    ], [
        {
            key: "y",
            get: function get() {
                return this.x;
            },
            set: function set(x) {
                this.y = this.x;
            }
        }
    ]);
    return C;
}(B);
var E = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(E, C);
    var _super = swcHelpers.createSuper(E);
    function E() {
        swcHelpers.classCallCheck(this, E);
        return _super.apply(this, arguments);
    }
    return E;
}(C);
