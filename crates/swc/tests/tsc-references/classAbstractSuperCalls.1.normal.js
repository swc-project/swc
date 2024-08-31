//// [classAbstractSuperCalls.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.foo = function foo() {
        return 1;
    };
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
    }
    var _proto = B.prototype;
    _proto.bar = function bar() {
        _get(_get_prototype_of(B.prototype), "foo", this).call(this);
    };
    _proto.baz = function baz() {
        return this.foo;
    };
    return B;
}(A);
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return 2;
    };
    _proto.qux = function qux() {
        return _get(_get_prototype_of(C.prototype), "foo", this).call(this) || _get(_get_prototype_of(C.prototype), "foo", this);
    } // 2 errors, foo is abstract
    ;
    _proto.norf = function norf() {
        return _get(_get_prototype_of(C.prototype), "bar", this).call(this);
    };
    return C;
}(B);
var AA = /*#__PURE__*/ function() {
    "use strict";
    function AA() {
        _class_call_check(this, AA);
    }
    var _proto = AA.prototype;
    _proto.foo = function foo() {
        return 1;
    };
    _proto.bar = function bar() {
        return this.foo();
    };
    return AA;
}();
var BB = /*#__PURE__*/ function(AA) {
    "use strict";
    _inherits(BB, AA);
    function BB() {
        _class_call_check(this, BB);
        return _call_super(this, BB, arguments);
    }
    return BB;
}(AA);
