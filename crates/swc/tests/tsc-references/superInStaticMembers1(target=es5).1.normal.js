//// [superInStaticMembers1.ts]
//// [external.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
};
var _default = function _default() {
    "use strict";
    _class_call_check(this, _default);
};
export { _default as default };
//// [locals.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var _this = this, _superprop_get_w = ()=>super.w;
var __ = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), __4 = new WeakMap(), __5 = new WeakMap(), __6 = new WeakMap(), __7 = new WeakMap(), __8 = new WeakMap(), __9 = new WeakMap(), __10 = new WeakMap(), __11 = new WeakMap(), __12 = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = [
        function() {
            var Reflect; // collision (es2015-es2021 only)
            _superprop_get_w().call(_this);
        }(),
        function() {
            var Reflect = {
                Reflect: null
            }.Reflect; // collision (es2015-es2021 only)
            _superprop_get_w().call(_this);
        }(),
        function() {
            var Reflect = null; // collision (es2015-es2021 only)
            _superprop_get_w().call(_this);
        }(),
        function() {
            var Reflect = function Reflect() {
                "use strict";
                _class_call_check(this, Reflect);
            } // collision (es2015-es2021 only)
            ;
            _superprop_get_w().call(_this);
        }(),
        function() {
            var Reflect = function Reflect() {} // collision (es2015-es2021 only)
            ;
            _superprop_get_w().call(_this);
        }(),
        function() {
            var Reflect = /*#__PURE__*/ function(Reflect) {
                return Reflect;
            }({})// collision (es2015-es2021 only)
            ;
            _superprop_get_w().call(_this);
        }(),
        function() {
            _superprop_get_w().call(_this);
        }(),
        function() {
            _superprop_get_w().call(_this);
        }(),
        function() {
            ; // no collision
            _superprop_get_w().call(_this);
        }(),
        function() {
            (function Reflect() {
                "use strict";
                _class_call_check(this, Reflect);
            }); // no collision
            _superprop_get_w().call(_this);
        }(),
        function() {
            (function Reflect() {}); // no collision
            _superprop_get_w().call(_this);
        }()
    ]
});
__2.set(C, {
    writable: true,
    value: function() {
        var Reflect = {
            Reflect: null
        }.Reflect; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }()
});
__3.set(C, {
    writable: true,
    value: function() {
        var Reflect = null; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }()
});
__4.set(C, {
    writable: true,
    value: function() {
        var Reflect; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }()
});
__5.set(C, {
    writable: true,
    value: function() {
        var Reflect = function Reflect() {
            "use strict";
            _class_call_check(this, Reflect);
        } // collision (es2015-es2021 only)
        ;
        _superprop_get_w().call(_this);
    }()
});
__6.set(C, {
    writable: true,
    value: function() {
        var Reflect = function Reflect() {} // collision (es2015-es2021 only)
        ;
        _superprop_get_w().call(_this);
    }()
});
__7.set(C, {
    writable: true,
    value: function() {
        var Reflect = /*#__PURE__*/ function(Reflect) {
            return Reflect;
        }({})// collision (es2015-es2021 only)
        ;
        _superprop_get_w().call(_this);
    }()
});
__8.set(C, {
    writable: true,
    value: super.w()
});
__9.set(C, {
    writable: true,
    value: super.w()
});
__10.set(C, {
    writable: true,
    value: super.w()
});
__11.set(C, {
    writable: true,
    value: function() {
        (function Reflect() {
            "use strict";
            _class_call_check(this, Reflect);
        } // no collision
        );
        _superprop_get_w().call(_this);
    }()
});
__12.set(C, {
    writable: true,
    value: function() {
        (function Reflect() {} // no collision
        );
        _superprop_get_w().call(_this);
    }()
});
export { };
//// [varInContainingScopeStaticField1.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var Reflect = null; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [varInContainingScopeStaticField2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var Reflect = {
    Reflect: null
}.Reflect; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [varInContainingScopeStaticField3.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var Reflect = null; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [varInContainingScopeStaticBlock1.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var Reflect = null; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [varInContainingScopeStaticBlock2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var Reflect = {
    Reflect: null
}.Reflect; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [varInContainingScopeStaticBlock3.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var Reflect = null; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [classDeclInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
} // collision (es2015-es2021 only)
;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [classDeclInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
} // collision (es2015-es2021 only)
;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [funcDeclInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
function Reflect() {} // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [funcDeclInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
function Reflect() {} // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [valueNamespaceInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [valueNamespaceInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [enumInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var Reflect = /*#__PURE__*/ function(Reflect) {
    return Reflect;
}(Reflect || {})// collision (es2015-es2021 only)
;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [enumInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var Reflect = /*#__PURE__*/ function(Reflect) {
    return Reflect;
}(Reflect || {})// collision (es2015-es2021 only)
;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [constEnumInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [constEnumInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [namespaceImportInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // collision (es2015-es2021 only)
//// [namespaceImportInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // collision (es2015-es2021 only)
//// [namedImportInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // collision (es2015-es2021 only)
//// [namedImportInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // collision (es2015-es2021 only)
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // collision (es2015-es2021 only)
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // collision (es2015-es2021 only)
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // no collision
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // no collision
//// [defaultImportInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // collision (es2015-es2021 only)
//// [defaultImportInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // collision (es2015-es2021 only)
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // no collision
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // no collision
//// [typeInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [typeInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [interfaceInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [interfaceInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [classExprInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
(function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
}); // no collision
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [classExprInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
(function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
}); // no collision
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [inContainingClassExprStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var _this = this, _superprop_get_w = ()=>super.w;
var __ = new WeakMap(), Reflect;
Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
}, __.set(Reflect, {
    writable: true,
    value: function() {
        var __ = new WeakMap();
        var C = /*#__PURE__*/ function(B1) {
            "use strict";
            _inherits(C, B1);
            function C() {
                _class_call_check(this, C);
                return _call_super(this, C, arguments);
            }
            return C;
        }(B);
        __.set(C, {
            writable: true,
            value: C._ = _superprop_get_w().call(_this)
        });
    }()
}), Reflect;
export { };
//// [inContainingClassExprStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var _this = this, _superprop_get_w = ()=>super.w;
var __ = new WeakMap(), Reflect;
Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
}, __.set(Reflect, {
    writable: true,
    value: function() {
        var __ = new WeakMap();
        var C = /*#__PURE__*/ function(B1) {
            "use strict";
            _inherits(C, B1);
            function C() {
                _class_call_check(this, C);
                return _call_super(this, C, arguments);
            }
            return C;
        }(B);
        __.set(C, {
            writable: true,
            value: _superprop_get_w().call(_this)
        });
    }()
}), Reflect;
export { };
//// [funcExprInContainingScopeStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
(function Reflect() {}); // no collision
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [funcExprInContainingScopeStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap();
(function Reflect() {}); // no collision
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [inContainingFuncExprStaticField.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
(function Reflect() {
    var __ = new WeakMap();
    var C = /*#__PURE__*/ function(B1) {
        "use strict";
        _inherits(C, B1);
        function C() {
            _class_call_check(this, C);
            return _call_super(this, C, arguments);
        }
        return C;
    }(B);
    __.set(C, {
        writable: true,
        value: C._ = super.w()
    });
});
export { };
//// [inContainingFuncExprStaticBlock.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
(function Reflect() {
    var __ = new WeakMap();
    var C = /*#__PURE__*/ function(B1) {
        "use strict";
        _inherits(C, B1);
        function C() {
            _class_call_check(this, C);
            return _call_super(this, C, arguments);
        }
        return C;
    }(B);
    __.set(C, {
        writable: true,
        value: super.w()
    });
});
export { };
