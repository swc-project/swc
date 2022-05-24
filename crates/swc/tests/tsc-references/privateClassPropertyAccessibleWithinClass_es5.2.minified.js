import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function() {
        return this.foo;
    }, C.foo = function() {
        return this.foo;
    }, C.bar = function() {
        this.foo();
    }, _create_class(C, [
        {
            key: "y",
            get: function() {
                return this.x;
            },
            set: function(x) {
                this.y = this.x;
            }
        }
    ], [
        {
            key: "y",
            get: function() {
                return this.x;
            },
            set: function(x) {
                this.y = this.x;
            }
        }
    ]), C;
}(), C2 = function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.prototype.foo = function() {}, C2.foo = function() {}, C2.bar = function() {}, _create_class(C2, [
        {
            key: "y",
            get: function() {
                return null;
            },
            set: function(x) {}
        }
    ], [
        {
            key: "y",
            get: function() {
                return null;
            },
            set: function(x) {}
        }
    ]), C2;
}();
