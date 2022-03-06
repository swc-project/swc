import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C(foo) {
        swcHelpers.classCallCheck(this, C), this.foo = foo, this.qux = this.bar, this.bar = this.foo, this.quiz = this.bar, this.quench = this.m1(), this.quanch = this.m3(), this.m3 = function() {}, this.quim = this.baz, this.baz = this.foo, this.quid = this.baz;
    }
    var _proto = C.prototype;
    return _proto.m1 = function() {
        this.foo;
    }, _proto.m2 = function() {
        this.foo;
    }, C;
}(), D = function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        var _this;
        return swcHelpers.classCallCheck(this, D), _this = _super.apply(this, arguments), _this.quill = _this.foo, _this;
    }
    return D;
}(C), E = function(foo2) {
    "use strict";
    var _this = this;
    swcHelpers.classCallCheck(this, E), this.foo2 = foo2, this.bar = function() {
        return _this.foo1 + _this.foo2;
    }, this.foo1 = "";
}, F = function() {
    "use strict";
    swcHelpers.classCallCheck(this, F), this.Inner = (function(F1) {
        swcHelpers.inherits(_class, F1);
        var _super = swcHelpers.createSuper(_class);
        function _class() {
            var _this;
            return swcHelpers.classCallCheck(this, _class), _this = _super.apply(this, arguments), _this.p2 = _this.p1, _this;
        }
        return _class;
    })(F), this.p1 = 0;
}, G = function(p1) {
    "use strict";
    swcHelpers.classCallCheck(this, G), this.p1 = p1, this.Inner = (function(G1) {
        swcHelpers.inherits(_class, G1);
        var _super = swcHelpers.createSuper(_class);
        function _class() {
            var _this;
            return swcHelpers.classCallCheck(this, _class), _this = _super.apply(this, arguments), _this.p2 = _this.p1, _this;
        }
        return _class;
    })(G);
}, H = function(p1) {
    "use strict";
    var _this = this;
    swcHelpers.classCallCheck(this, H), this.p1 = p1, this.p2 = function() {
        return _this.p1.foo;
    }, this.p3 = function() {
        return _this.p1.foo;
    };
};
