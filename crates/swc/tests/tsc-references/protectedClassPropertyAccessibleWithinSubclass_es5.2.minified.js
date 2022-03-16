import * as swcHelpers from "@swc/helpers";
var B = function() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
}, C = function(B1) {
    "use strict";
    swcHelpers.inherits(C, B1);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    return _proto.foo = function() {
        return this.x;
    }, _proto.bar = function() {
        return this.foo();
    }, C.foo = function() {
        return this.x;
    }, C.bar = function() {
        this.foo();
    }, swcHelpers.createClass(C, [
        {
            key: "y",
            get: function() {
                return this.x;
            },
            set: function(x) {
                this.y = this.x;
            }
        }
    ], [
        {
            key: "y",
            get: function() {
                return this.x;
            },
            set: function(x) {
                this.y = this.x;
            }
        }
    ]), C;
}(B);
