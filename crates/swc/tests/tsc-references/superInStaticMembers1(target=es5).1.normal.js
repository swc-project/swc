//// [superInStaticMembers1.ts]
//// [external.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
