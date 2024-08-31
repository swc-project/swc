//// [derivedGenericClassWithAny.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return null;
    };
    _create_class(C, [
        {
            key: "X",
            get: function get() {
                return null;
            }
        }
    ]);
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    var _proto = D.prototype;
    _proto.foo = function foo() {
        return 1;
    };
    D.bar = function bar() {
        return null;
    };
    _create_class(D, [
        {
            key: "X",
            get: function get() {
                return null;
            }
        }
    ], [
        {
            key: "Y",
            get: function get() {
                return null;
            }
        }
    ]);
    return D;
}(C);
// if D is a valid class definition than E is now not safe tranisitively through C
var E = /*#__PURE__*/ function(D) {
    "use strict";
    _inherits(E, D);
    function E() {
        _class_call_check(this, E);
        return _call_super(this, E, arguments);
    }
    var _proto = E.prototype;
    _proto.foo = function foo() {
        return ''; // error
    };
    _create_class(E, [
        {
            key: "X",
            get: function get() {
                return '';
            } // error
        }
    ]);
    return E;
}(D);
var c;
var d;
var e;
c = d;
c = e;
var r = c.foo(); // e.foo would return string
