import * as swcHelpers from "@swc/helpers";
var B = function() {
    swcHelpers.classCallCheck(this, B);
}, C = function(B1) {
    swcHelpers.inherits(C, B1);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    return _proto.foo = function() {
        return this.x;
    }, _proto.bar = function() {
        var D = function() {
            function D() {
                swcHelpers.classCallCheck(this, D);
            }
            return D.prototype.foo = function() {
                var c = new C();
                c.y, c.x, c.foo, c.bar, c.z, C.x, C.y, C.foo, C.bar;
            }, D;
        }();
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
}(B), E = function(C) {
    swcHelpers.inherits(E, C);
    var _super = swcHelpers.createSuper(E);
    function E() {
        return swcHelpers.classCallCheck(this, E), _super.apply(this, arguments);
    }
    return E;
}(C);
