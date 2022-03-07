import * as swcHelpers from "@swc/helpers";
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
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return this.x;
    };
    _proto.bar = function bar() {
        return this.foo();
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
