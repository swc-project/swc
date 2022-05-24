import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var e, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function() {
        return 1;
    }, C.bar = function() {
        return 1;
    }, _create_class(C, [
        {
            key: "X",
            get: function() {
                return 1;
            }
        }
    ], [
        {
            key: "Y",
            get: function() {
                return 1;
            }
        }
    ]), C;
}(), D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D.prototype.foo = function() {
        return 1;
    }, D.bar = function() {
        return null;
    }, _create_class(D, [
        {
            key: "X",
            get: function() {
                return null;
            }
        }
    ], [
        {
            key: "Y",
            get: function() {
                return null;
            }
        }
    ]), D;
}(C), E = function(D) {
    "use strict";
    _inherits(E, D);
    var _super = _create_super(E);
    function E() {
        return _class_call_check(this, E), _super.apply(this, arguments);
    }
    return E.prototype.foo = function() {
        return "";
    }, E.bar = function() {
        return "";
    }, _create_class(E, [
        {
            key: "X",
            get: function() {
                return "";
            }
        }
    ], [
        {
            key: "Y",
            get: function() {
                return "";
            }
        }
    ]), E;
}(D);
e.foo();
