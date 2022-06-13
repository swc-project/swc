import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var B = function() {
    "use strict";
    _class_call_check(this, B);
}, C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    return _proto.foo = function() {
        return this.x;
    }, _proto.bar = function() {
        var D = function() {
            function D() {
                _class_call_check(this, D);
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
    }, _create_class(C, [
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
    "use strict";
    _inherits(E, C);
    var _super = _create_super(E);
    function E() {
        return _class_call_check(this, E), _super.apply(this, arguments);
    }
    return E;
}(C);
