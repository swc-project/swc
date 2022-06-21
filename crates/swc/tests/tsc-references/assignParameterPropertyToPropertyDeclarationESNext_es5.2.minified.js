import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function() {
    "use strict";
    function C(foo) {
        _class_call_check(this, C), this.foo = foo, this.qux = this.bar, this.bar = this.foo, this.quiz = this.bar, this.quench = this.m1(), this.quanch = this.m3(), this.m3 = function() {}, this.quim = this.baz, this.baz = this.foo, this.quid = this.baz;
    }
    var _proto = C.prototype;
    return _proto.m1 = function() {
        this.foo;
    }, _proto.m2 = function() {
        this.foo;
    }, C;
}(), D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        var _this;
        return _class_call_check(this, D), _this = _super.apply(this, arguments), _this.quill = _this.foo, _this;
    }
    return D;
}(C), E = function(foo2) {
    "use strict";
    var _this = this;
    _class_call_check(this, E), this.foo2 = foo2, this.bar = function() {
        return _this.foo1 + _this.foo2;
    }, this.foo1 = "";
}, F = function() {
    "use strict";
    _class_call_check(this, F), this.Inner = function(F) {
        _inherits(_class, F);
        var _super = _create_super(_class);
        function _class() {
            var _this;
            return _class_call_check(this, _class), _this = _super.apply(this, arguments), _this.p2 = _this.p1, _this;
        }
        return _class;
    }(F), this.p1 = 0;
}, G = function(p1) {
    "use strict";
    _class_call_check(this, G), this.p1 = p1, this.Inner = function(G) {
        _inherits(_class, G);
        var _super = _create_super(_class);
        function _class() {
            var _this;
            return _class_call_check(this, _class), _this = _super.apply(this, arguments), _this.p2 = _this.p1, _this;
        }
        return _class;
    }(G);
}, H = function(p1) {
    "use strict";
    var _this = this;
    _class_call_check(this, H), this.p1 = p1, this.p2 = function() {
        return _this.p1.foo;
    }, this.p3 = function() {
        return _this.p1.foo;
    };
};
