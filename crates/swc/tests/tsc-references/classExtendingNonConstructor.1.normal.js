//// [classExtendingNonConstructor.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var x;
function foo() {
    this.x = 1;
}
var C1 = /*#__PURE__*/ function(undefined1) {
    "use strict";
    _inherits(C1, undefined1);
    function C1() {
        _class_call_check(this, C1);
        return _call_super(this, C1, arguments);
    }
    return C1;
}(undefined);
var C2 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(C2, _superClass);
    function C2() {
        _class_call_check(this, C2);
        return _call_super(this, C2, arguments);
    }
    return C2;
}(true);
var C3 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(C3, _superClass);
    function C3() {
        _class_call_check(this, C3);
        return _call_super(this, C3, arguments);
    }
    return C3;
}(false);
var C4 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(C4, _superClass);
    function C4() {
        _class_call_check(this, C4);
        return _call_super(this, C4, arguments);
    }
    return C4;
}(42);
var C5 = /*#__PURE__*/ function(_hello) {
    "use strict";
    _inherits(C5, _hello);
    function C5() {
        _class_call_check(this, C5);
        return _call_super(this, C5, arguments);
    }
    return C5;
}("hello");
var C6 = /*#__PURE__*/ function(x) {
    "use strict";
    _inherits(C6, x);
    function C6() {
        _class_call_check(this, C6);
        return _call_super(this, C6, arguments);
    }
    return C6;
}(x);
var C7 = /*#__PURE__*/ function(foo) {
    "use strict";
    _inherits(C7, foo);
    function C7() {
        _class_call_check(this, C7);
        return _call_super(this, C7, arguments);
    }
    return C7;
}(foo);
