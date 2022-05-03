import * as swcHelpers from "@swc/helpers";
// @useDefineForClassFields: true
// @target: esnext
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(foo) {
        swcHelpers.classCallCheck(this, C);
        this.foo = foo;
        this.qux = this.bar // should error
        ;
        this.bar = this.foo // should error
        ;
        this.quiz = this.bar // ok
        ;
        this.quench = this.m1() // ok
        ;
        this.quanch = this.m3() // should error
        ;
        this.m3 = function() {};
        this.quim = this.baz // should error
        ;
        this.baz = this.foo // should error
        ;
        this.quid = this.baz // ok
        ;
    }
    var _proto = C.prototype;
    _proto.m1 = function m1() {
        this.foo // ok
        ;
    };
    _proto.m2 = function m2() {
        this.foo // ok
        ;
    };
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        var _this;
        _this = _super.apply(this, arguments);
        _this.quill = _this.foo // ok
        ;
        return _this;
    }
    return D;
}(C);
var E = function E(foo2) {
    "use strict";
    var _this = this;
    swcHelpers.classCallCheck(this, E);
    this.foo2 = foo2;
    this.bar = function() {
        return _this.foo1 + _this.foo2;
    } // both ok
    ;
    this.foo1 = "";
};
var F1 = function F1() {
    "use strict";
    swcHelpers.classCallCheck(this, F1);
    this.Inner = /*#__PURE__*/ function(F2) {
        swcHelpers.inherits(_class, F2);
        var _super = swcHelpers.createSuper(_class);
        function _class() {
            swcHelpers.classCallCheck(this, _class);
            var _this;
            _this = _super.apply(this, arguments);
            _this.p2 = _this.p1;
            return _this;
        }
        return _class;
    }(F1);
    this.p1 = 0;
};
var G1 = function G1(p1) {
    "use strict";
    swcHelpers.classCallCheck(this, G1);
    this.p1 = p1;
    this.Inner = /*#__PURE__*/ function(G2) {
        swcHelpers.inherits(_class, G2);
        var _super = swcHelpers.createSuper(_class);
        function _class() {
            swcHelpers.classCallCheck(this, _class);
            var _this;
            _this = _super.apply(this, arguments);
            _this.p2 = _this.p1;
            return _this;
        }
        return _class;
    }(G1);
};
var H = function H(p1) {
    "use strict";
    var _this = this;
    swcHelpers.classCallCheck(this, H);
    this.p1 = p1;
    this.p2 = function() {
        return _this.p1.foo;
    };
    this.p3 = function() {
        return _this.p1.foo;
    };
};
