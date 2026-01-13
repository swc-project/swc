//// [staticPropertyNotInClassType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
(function(NonGeneric) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C(a, b) {
            _class_call_check(this, C);
            this.a = a;
            this.b = b;
        }
        var _proto = C.prototype;
        _proto.fn = function fn() {
            return this;
        };
        _create_class(C, null, [
            {
                key: "x",
                get: function get() {
                    return 1;
                },
                set: function set(v) {}
            }
        ]);
        return C;
    }();
    (function(C) {
        C.bar = ''; // not reflected in class type
    })(C || (C = {}));
    var c = new C(1, 2);
    var r = c.fn();
    var r4 = c.foo; // error
    var r5 = c.bar; // error
    var r6 = c.x; // error
})(NonGeneric || (NonGeneric = {}));
(function(Generic) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C(a, b) {
            _class_call_check(this, C);
            this.a = a;
            this.b = b;
        }
        var _proto = C.prototype;
        _proto.fn = function fn() {
            return this;
        };
        _create_class(C, null, [
            {
                key: "x",
                get: function get() {
                    return 1;
                },
                set: function set(v) {}
            }
        ]);
        return C;
    }();
    (function(C) {
        C.bar = ''; // not reflected in class type
    })(C || (C = {}));
    var c = new C(1, '');
    var r = c.fn();
    var r4 = c.foo; // error
    var r5 = c.bar; // error
    var r6 = c.x; // error
})(Generic || (Generic = {}));
var NonGeneric, Generic;
