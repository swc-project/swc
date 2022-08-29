//// [superInStaticMembers1.ts]
//// [external.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
};
export var Baz;
(function(Baz) {})(Baz || (Baz = {}));
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
var _this = this, _superprop_get_w = ()=>super.w;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = [
    function() {
        var Reflect; // collision (es2015-es2021 only)
        _get(_get_prototype_of(C), "w", C).call(C);
    }(),
    function() {
        var Reflect = {
            Reflect: null
        }.Reflect; // collision (es2015-es2021 only)
        _get(_get_prototype_of(C), "w", C).call(C);
    }(),
    function() {
        var Reflect = null; // collision (es2015-es2021 only)
        _get(_get_prototype_of(C), "w", C).call(C);
    }(),
    function() {
        var Reflect = function Reflect() {
            "use strict";
            _class_call_check(this, Reflect);
        } // collision (es2015-es2021 only)
        ;
        _get(_get_prototype_of(C), "w", C).call(C);
    }(),
    function() {
        var Reflect = function Reflect() {} // collision (es2015-es2021 only)
        ;
        _get(_get_prototype_of(C), "w", C).call(C);
    }(),
    function() {
        var Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        _get(_get_prototype_of(C), "w", C).call(C);
    }(),
    function() {
        var Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        _get(_get_prototype_of(C), "w", C).call(C);
    }(),
    function() {
        _get(_get_prototype_of(C), "w", C).call(C);
    }(),
    function() {
        _get(_get_prototype_of(C), "w", C).call(C);
    }(),
    function() {
        (function Reflect() {
            "use strict";
            _class_call_check(this, Reflect);
        }); // no collision
        _get(_get_prototype_of(C), "w", C).call(C);
    }(),
    function() {
        (function Reflect() {}); // no collision
        _get(_get_prototype_of(C), "w", C).call(C);
    }(), 
];
var __ = {
    writable: true,
    value: function() {
        var Reflect = {
            Reflect: null
        }.Reflect; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }()
};
var __1 = {
    writable: true,
    value: function() {
        var Reflect = null; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }()
};
var __2 = {
    writable: true,
    value: function() {
        var Reflect; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }()
};
var __3 = {
    writable: true,
    value: function() {
        var Reflect = function Reflect() {
            "use strict";
            _class_call_check(this, Reflect);
        } // collision (es2015-es2021 only)
        ;
        _superprop_get_w().call(_this);
    }()
};
var __4 = {
    writable: true,
    value: function() {
        var Reflect = function Reflect() {} // collision (es2015-es2021 only)
        ;
        _superprop_get_w().call(_this);
    }()
};
var __5 = {
    writable: true,
    value: function() {
        var Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        _superprop_get_w().call(_this);
    }()
};
var __6 = {
    writable: true,
    value: function() {
        var Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        _superprop_get_w().call(_this);
    }()
};
var __7 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var __8 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var __9 = {
    writable: true,
    value: function() {
        (function Reflect() {
            "use strict";
            _class_call_check(this, Reflect);
        }) // no collision
        ;
        _superprop_get_w().call(_this);
    }()
};
var __10 = {
    writable: true,
    value: function() {
        (function Reflect() {}) // no collision
        ;
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [varInContainingScopeStaticField1.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Reflect = null; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [varInContainingScopeStaticField2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Reflect = {
    Reflect: null
}.Reflect; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [varInContainingScopeStaticField3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Reflect = null; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [varInContainingScopeStaticBlock1.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var Reflect = null; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [varInContainingScopeStaticBlock2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var Reflect = {
    Reflect: null
}.Reflect; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [varInContainingScopeStaticBlock3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var Reflect = null; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [classDeclInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
} // collision (es2015-es2021 only)
;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [classDeclInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
} // collision (es2015-es2021 only)
;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [funcDeclInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function Reflect() {} // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [funcDeclInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
function Reflect() {} // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [valueNamespaceInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [valueNamespaceInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [enumInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [enumInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [constEnumInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [constEnumInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [namespaceImportInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namespaceImportInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [namedImportInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [defaultImportInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [defaultImportInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [typeInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [typeInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [interfaceInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [interfaceInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [classExprInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
(function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
}); // no collision
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [classExprInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
(function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
}); // no collision
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [inContainingClassExprStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _Reflect, __;
_Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
}, __ = {
    writable: true,
    value: function() {
        var C = /*#__PURE__*/ function(B1) {
            "use strict";
            _inherits(C, B1);
            var _super = _create_super(C);
            function C() {
                _class_call_check(this, C);
                return _super.apply(this, arguments);
            }
            return C;
        }(B);
        C._ = _get(_get_prototype_of(C), "w", C).call(C);
    }()
}, _Reflect;
export { };
//// [inContainingClassExprStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var _Reflect, __;
_Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
}, __ = {
    writable: true,
    value: function() {
        var C = /*#__PURE__*/ function(B1) {
            "use strict";
            _inherits(C, B1);
            var _super = _create_super(C);
            function C() {
                _class_call_check(this, C);
                return _super.apply(this, arguments);
            }
            return C;
        }(B);
        var __ = {
            writable: true,
            value: function() {
                _superprop_get_w().call(_this);
            }()
        };
    }()
}, _Reflect;
export { };
//// [funcExprInContainingScopeStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
(function Reflect() {}); // no collision
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [funcExprInContainingScopeStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
(function Reflect() {}); // no collision
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __ = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
export { };
//// [inContainingFuncExprStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
(function Reflect() {
    var C = /*#__PURE__*/ function(B1) {
        "use strict";
        _inherits(C, B1);
        var _super = _create_super(C);
        function C() {
            _class_call_check(this, C);
            return _super.apply(this, arguments);
        }
        return C;
    }(B);
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
});
export { };
//// [inContainingFuncExprStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
(function Reflect() {
    var _this = this, _superprop_get_w = ()=>super.w;
    var C = /*#__PURE__*/ function(B1) {
        "use strict";
        _inherits(C, B1);
        var _super = _create_super(C);
        function C() {
            _class_call_check(this, C);
            return _super.apply(this, arguments);
        }
        return C;
    }(B);
    var __ = {
        writable: true,
        value: function() {
            _superprop_get_w().call(_this);
        }()
    };
});
export { };
