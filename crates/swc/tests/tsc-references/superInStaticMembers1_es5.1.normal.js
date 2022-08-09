// @target: es5, es2015, es2021, es2022, esnext
// @noTypesAndSymbols: true
// @filename: external.ts
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
// @filename: locals.ts
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
// @filename: varInContainingScopeStaticField1.ts
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
// @filename: varInContainingScopeStaticField2.ts
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
// @filename: varInContainingScopeStaticField3.ts
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
// @filename: varInContainingScopeStaticBlock1.ts
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
// @filename: varInContainingScopeStaticBlock2.ts
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
// @filename: varInContainingScopeStaticBlock3.ts
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
// @filename: classDeclInContainingScopeStaticField.ts
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
// @filename: classDeclInContainingScopeStaticBlock.ts
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
// @filename: funcDeclInContainingScopeStaticField.ts
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
// @filename: funcDeclInContainingScopeStaticBlock.ts
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
// @filename: valueNamespaceInContainingScopeStaticField.ts
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
// @filename: valueNamespaceInContainingScopeStaticBlock.ts
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
// @filename: enumInContainingScopeStaticField.ts
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
// @filename: enumInContainingScopeStaticBlock.ts
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
// @filename: constEnumInContainingScopeStaticField.ts
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
// @filename: constEnumInContainingScopeStaticBlock.ts
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
// @filename: namespaceImportInContainingScopeStaticField.ts
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
// @filename: namespaceImportInContainingScopeStaticBlock.ts
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
// @filename: namedImportInContainingScopeStaticField.ts
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
// @filename: namedImportInContainingScopeStaticBlock.ts
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
// @filename: namedImportOfInterfaceInContainingScopeStaticField.ts
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
// @filename: namedImportOfInterfaceInContainingScopeStaticBlock.ts
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
// @filename: namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts
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
// @filename: namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts
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
// @filename: namedImportOfConstEnumInContainingScopeStaticField.ts
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
// @filename: namedImportOfConstEnumInContainingScopeStaticBlock.ts
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
// @filename: typeOnlyNamedImportInContainingScopeStaticField.ts
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
// @filename: typeOnlyNamedImportInContainingScopeStaticBlock.ts
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
// @filename: defaultImportInContainingScopeStaticField.ts
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
// @filename: defaultImportInContainingScopeStaticBlock.ts
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
// @filename: typeOnlyDefaultImportInContainingScopeStaticField.ts
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
// @filename: typeOnlyDefaultImportInContainingScopeStaticBlock.ts
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
// @filename: typeInContainingScopeStaticField.ts
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
// @filename: typeInContainingScopeStaticBlock.ts
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
// @filename: interfaceInContainingScopeStaticField.ts
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
// @filename: interfaceInContainingScopeStaticBlock.ts
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
// @filename: uninstantiatedNamespaceInContainingScopeStaticField.ts
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
// @filename: uninstantiatedNamespaceInContainingScopeStaticBlock.ts
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
// @filename: classExprInContainingScopeStaticField.ts
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
// @filename: classExprInContainingScopeStaticBlock.ts
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
// @filename: inContainingClassExprStaticField.ts
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
// @filename: inContainingClassExprStaticBlock.ts
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
// @filename: funcExprInContainingScopeStaticField.ts
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
// @filename: funcExprInContainingScopeStaticBlock.ts
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
// @filename: inContainingFuncExprStaticField.ts
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
// @filename: inContainingFuncExprStaticBlock.ts
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
