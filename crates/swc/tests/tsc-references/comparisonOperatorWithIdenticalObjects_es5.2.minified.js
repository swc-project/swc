import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A1 = function() {
    "use strict";
    function A1() {
        _class_call_check(this, A1);
    }
    return A1.prototype.fn = function(a) {
        return null;
    }, A1;
}(), B1 = function() {
    "use strict";
    function B1() {
        _class_call_check(this, B1);
    }
    return B1.prototype.fn = function(b) {
        return null;
    }, B1;
}(), Base = function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.prototype.fn = function(b) {
        return null;
    }, Base;
}(), A2 = function(Base) {
    "use strict";
    _inherits(A2, Base);
    var _super = _create_super(A2);
    function A2() {
        return _class_call_check(this, A2), _super.apply(this, arguments);
    }
    return A2;
}(Base), B2 = function(Base) {
    "use strict";
    _inherits(B2, Base);
    var _super = _create_super(B2);
    function B2() {
        return _class_call_check(this, B2), _super.apply(this, arguments);
    }
    return B2;
}(Base);
