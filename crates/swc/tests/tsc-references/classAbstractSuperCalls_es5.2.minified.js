import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.foo = function() {
        return 1;
    }, A;
}(), B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    return _proto.bar = function() {
        _get(_get_prototype_of(B.prototype), "foo", this).call(this);
    }, _proto.baz = function() {
        return this.foo;
    }, B;
}(A), C = function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    return _proto.foo = function() {
        return 2;
    }, _proto.qux = function() {
        return _get(_get_prototype_of(C.prototype), "foo", this).call(this) || _get(_get_prototype_of(C.prototype), "foo", this);
    }, _proto.norf = function() {
        return _get(_get_prototype_of(C.prototype), "bar", this).call(this);
    }, C;
}(B), AA = function() {
    "use strict";
    function AA() {
        _class_call_check(this, AA);
    }
    var _proto = AA.prototype;
    return _proto.foo = function() {
        return 1;
    }, _proto.bar = function() {
        return this.foo();
    }, AA;
}(), BB = function(AA) {
    "use strict";
    _inherits(BB, AA);
    var _super = _create_super(BB);
    function BB() {
        return _class_call_check(this, BB), _super.apply(this, arguments);
    }
    return BB;
}(AA);
