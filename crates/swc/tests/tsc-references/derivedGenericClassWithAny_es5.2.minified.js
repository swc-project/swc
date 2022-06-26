import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var e, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function() {
        return null;
    }, _create_class(C, [
        {
            key: "X",
            get: function() {
                return null;
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
    }, _create_class(E, [
        {
            key: "X",
            get: function() {
                return "";
            }
        }
    ]), E;
}(D);
e.foo();
