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
(function() {
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
            function Reflect() {} // collision (es2015-es2021 only)
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
        }()
    ];
})();
(function() {
    var Reflect = {
        Reflect: null
    }.Reflect; // collision (es2015-es2021 only)
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(function() {
    var Reflect = null; // collision (es2015-es2021 only)
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(function() {
    var Reflect; // collision (es2015-es2021 only)
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(function() {
    var Reflect = function Reflect() {
        "use strict";
        _class_call_check(this, Reflect);
    } // collision (es2015-es2021 only)
    ;
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(function() {
    var Reflect = function Reflect() {} // collision (es2015-es2021 only)
    ;
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(function() {
    var Reflect// collision (es2015-es2021 only)
    ;
    (function(Reflect) {})(Reflect || (Reflect = {}));
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(function() {
    var Reflect// collision (es2015-es2021 only)
    ;
    (function(Reflect) {})(Reflect || (Reflect = {}));
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(function() {
    (function Reflect() {
        "use strict";
        _class_call_check(this, Reflect);
    } // no collision
    );
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(function() {
    (function Reflect() {} // no collision
    );
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [varInContainingScopeStaticBlock1.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [varInContainingScopeStaticBlock2.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [varInContainingScopeStaticBlock3.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [classDeclInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [funcDeclInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [valueNamespaceInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [enumInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [constEnumInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [namespaceImportInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [namedImportInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [defaultImportInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [typeInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [interfaceInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [classExprInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [inContainingClassExprStaticField.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _Reflect;
_Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
}, function() {
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
    (function() {
        C._ = _get(_get_prototype_of(C), "w", C).call(C);
    })();
}(), _Reflect;
export { };
//// [inContainingClassExprStaticBlock.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _Reflect;
_Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
}, function() {
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
    (function() {
        _get(_get_prototype_of(C), "w", C).call(C);
    })();
}(), _Reflect;
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
(function() {
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [funcExprInContainingScopeStaticBlock.ts]
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
(function() {
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
    (function() {
        C._ = _get(_get_prototype_of(C), "w", C).call(C);
    })();
});
export { };
//// [inContainingFuncExprStaticBlock.ts]
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
    (function() {
        _get(_get_prototype_of(C), "w", C).call(C);
    })();
});
export { };
