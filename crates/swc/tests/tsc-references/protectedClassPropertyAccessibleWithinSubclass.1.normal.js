//// [protectedClassPropertyAccessibleWithinSubclass.ts]
// no errors
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return this.x;
    };
    _proto.bar = function bar() {
        return this.foo();
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
