import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, _superprop_get_w = ()=>super.w;
var _Reflect, __, _Reflect1, __1;
// @target: es5, es2015, es2021, es2022, esnext
// @noTypesAndSymbols: true
// @filename: external.ts
export var Reflect = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
};
export var Baz;
(function(Baz) {})(Baz || (Baz = {}));
var _class = function _class() {
    "use strict";
    _class_call_check(this, _class);
};
export { _class as default };
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
var __2 = {
    writable: true,
    value: function() {
        var Reflect = {
            Reflect: null
        }.Reflect; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }()
};
var __11 = {
    writable: true,
    value: function() {
        var Reflect = null; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }()
};
var __21 = {
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
var __12 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __13 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __14 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __15 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __16 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __17 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __18 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __19 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __20 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __22 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __23 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __24 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __25 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __26 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __27 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __28 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __29 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __30 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __31 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
var __32 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
_Reflect1 = function Reflect() {
    "use strict";
    _class_call_check(this, Reflect);
}, __1 = {
    writable: true,
    value: function() {
        var _this1 = _this, _superprop_get_w1 = ()=>_superprop_get_w();
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
                _superprop_get_w1().call(_this1);
            }()
        };
    }()
}, _Reflect1;
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
var __33 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
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
