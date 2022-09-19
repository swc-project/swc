//// [superInStaticMembers1.ts]
//// [external.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
};
export var Baz;
Baz || (Baz = {});
var _default = function _default() {
    "use strict";
    _class_call_check(this, _default);
};
export { _default as default };
//// [locals.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w, C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = [
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C),
    function() {
        var Reflect;
        Reflect || (Reflect = {}), _get(_get_prototype_of(C), "w", C).call(C);
    }(),
    function() {
        var Reflect;
        Reflect || (Reflect = {}), _get(_get_prototype_of(C), "w", C).call(C);
    }(),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C)
], _superprop_get_w().call(_this), _superprop_get_w().call(_this), _superprop_get_w().call(_this), _superprop_get_w().call(_this), _superprop_get_w().call(_this), function() {
    var Reflect;
    Reflect || (Reflect = {}), _superprop_get_w().call(_this);
}(), function() {
    var Reflect;
    Reflect || (Reflect = {}), _superprop_get_w().call(_this);
}(), _superprop_get_w().call(_this), _superprop_get_w().call(_this), _superprop_get_w().call(_this), _superprop_get_w().call(_this);
//// [varInContainingScopeStaticField1.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticField2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticField3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticBlock1.ts]
super.w.call(this);
export { };
//// [varInContainingScopeStaticBlock2.ts]
super.w.call(this);
export { };
//// [varInContainingScopeStaticBlock3.ts]
super.w.call(this);
export { };
//// [classDeclInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [classDeclInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [funcDeclInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [funcDeclInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [valueNamespaceInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [valueNamespaceInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [enumInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
Reflect || (Reflect = {});
var Reflect, C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [enumInContainingScopeStaticBlock.ts]
var Reflect;
Reflect || (Reflect = {}), super.w.call(this);
export { };
//// [constEnumInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
Reflect || (Reflect = {});
var Reflect, C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [constEnumInContainingScopeStaticBlock.ts]
var Reflect;
Reflect || (Reflect = {}), super.w.call(this);
export { };
//// [namespaceImportInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namespaceImportInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [namedImportInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [defaultImportInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [defaultImportInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [typeInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [interfaceInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [interfaceInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [classExprInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [classExprInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [inContainingClassExprStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function() {
    var C = function(B1) {
        "use strict";
        _inherits(C, B1);
        var _super = _create_super(C);
        function C() {
            return _class_call_check(this, C), _super.apply(this, arguments);
        }
        return C;
    }(B);
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
}();
//// [inContainingClassExprStaticBlock.ts]
super.w.call(this);
export { };
//// [funcExprInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [funcExprInContainingScopeStaticBlock.ts]
super.w.call(this);
export { };
//// [inContainingFuncExprStaticField.ts]
export { };
//// [inContainingFuncExprStaticBlock.ts]
export { };
