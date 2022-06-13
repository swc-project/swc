import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @useDefineForClassFields: true
// @target: esnext
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(foo) {
        _class_call_check(this, C);
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
        this.baz = this.foo;
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
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
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
    _class_call_check(this, E);
    this.foo2 = foo2;
    this.bar = function() {
        return _this.foo1 + _this.foo2;
    };
    this.foo1 = "";
};
var F1 = function F1() {
    "use strict";
    _class_call_check(this, F1);
    this.Inner = /*#__PURE__*/ function(F2) {
        _inherits(_class, F2);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
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
    _class_call_check(this, G1);
    this.p1 = p1;
    this.Inner = /*#__PURE__*/ function(G2) {
        _inherits(_class, G2);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
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
    _class_call_check(this, H);
    this.p1 = p1;
    this.p2 = function() {
        return _this.p1.foo;
    };
    this.p3 = function() {
        return _this.p1.foo;
    };
};
