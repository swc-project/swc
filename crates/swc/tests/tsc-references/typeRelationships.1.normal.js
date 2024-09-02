//// [typeRelationships.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.self = this;
        this.c = new C();
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return this;
    };
    _proto.f1 = function f1() {
        this.c = this.self;
        this.self = this.c; // Error
    };
    _proto.f2 = function f2() {
        var a;
        var a = [
            this,
            this.c
        ]; // C[] since this is subtype of C
        var b;
        var b = [
            this,
            this.self,
            null,
            undefined
        ];
    };
    _proto.f3 = function f3(b) {
        return b ? this.c : this.self; // Should be C
    };
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        var _this;
        _this = _call_super(this, D, arguments), _this.self1 = _this, _this.self2 = _this.self, _this.self3 = _this.foo(), _this.d = new D();
        return _this;
    }
    var _proto = D.prototype;
    _proto.bar = function bar() {
        this.self = this.self1;
        this.self = this.self2;
        this.self = this.self3;
        this.self1 = this.self;
        this.self2 = this.self;
        this.self3 = this.self;
        this.d = this.self;
        this.d = this.c; // Error
        this.self = this.d; // Error
        this.c = this.d;
    };
    return D;
}(C);
