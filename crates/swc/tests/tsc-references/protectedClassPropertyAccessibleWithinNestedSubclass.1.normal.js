//// [protectedClassPropertyAccessibleWithinNestedSubclass.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return this.x;
    };
    _proto.bar = function bar() {
        var D = /*#__PURE__*/ function() {
            function D() {
                _class_call_check(this, D);
            }
            var _proto = D.prototype;
            _proto.foo = function foo() {
                var c = new C();
                var c1 = c.y;
                var c2 = c.x;
                var c3 = c.foo;
                var c4 = c.bar;
                var c5 = c.z; // error
                var sc1 = C.x;
                var sc2 = C.y;
                var sc3 = C.foo;
                var sc4 = C.bar;
            };
            return D;
        }();
    };
    C.foo = function foo() {
        return this.x;
    };
    C.bar = function bar() {
        this.foo();
    };
    _create_class(C, [
        {
            key: "y",
            get: function get() {
                return this.x;
            },
            set: function set(x) {
                this.y = this.x;
            }
        }
    ], [
        {
            key: "y",
            get: function get() {
                return this.x;
            },
            set: function set(x) {
                this.y = this.x;
            }
        }
    ]);
    return C;
}(B);
var E = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(E, C);
    function E() {
        _class_call_check(this, E);
        return _call_super(this, E, arguments);
    }
    return E;
}(C);
