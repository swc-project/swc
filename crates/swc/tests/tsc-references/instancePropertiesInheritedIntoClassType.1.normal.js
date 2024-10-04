//// [instancePropertiesInheritedIntoClassType.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
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
        _create_class(C, [
            {
                key: "y",
                get: function get() {
                    return 1;
                },
                set: function set(v) {}
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
        return D;
    }(C);
    var d = new D(1, 2);
    var r = d.fn();
    var r2 = r.x;
    var r3 = r.y;
    r.y = 4;
    var r6 = d.y(); // error
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
        _create_class(C, [
            {
                key: "y",
                get: function get() {
                    return null;
                },
                set: function set(v) {}
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
        return D;
    }(C);
    var d = new D(1, '');
    var r = d.fn();
    var r2 = r.x;
    var r3 = r.y;
    r.y = '';
    var r6 = d.y(); // error
})(Generic || (Generic = {}));
var NonGeneric, Generic;
