function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
// type of an array is the best common type of its elements (plus its contextual type if it exists)
var a = [
    1,
    ''
]; // {}[]
var b = [
    1,
    null
]; // number[]
var c = [
    1,
    '',
    null
]; // {}[]
var d = [
    {
    },
    1
]; // {}[]
var e = [
    {
    },
    Object
]; // {}[]
var f = [
    [],
    [
        1
    ]
]; // number[][]
var g = [
    [
        1
    ],
    [
        ''
    ]
]; // {}[]
var h = [
    {
        foo: 1,
        bar: ''
    },
    {
        foo: 2
    }
]; // {foo: number}[]
var i = [
    {
        foo: 1,
        bar: ''
    },
    {
        foo: ''
    }
]; // {}[]
var j = [
    function() {
        return 1;
    },
    function() {
        return '';
    }
]; // {}[]
var k = [
    function() {
        return 1;
    },
    function() {
        return 1;
    }
]; // { (): number }[]
var l = [
    function() {
        return 1;
    },
    function() {
        return null;
    }
]; // { (): any }[]
var m = [
    function() {
        return 1;
    },
    function() {
        return '';
    },
    function() {
        return null;
    }
]; // { (): any }[]
var n = [
    [
        function() {
            return 1;
        }
    ],
    [
        function() {
            return '';
        }
    ]
]; // {}[]
var Base = function Base() {
    "use strict";
    _classCallCheck(this, Base);
};
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _createSuper(Derived1);
    function Derived1() {
        _classCallCheck(this, Derived1);
        return _super.apply(this, arguments);
    }
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _createSuper(Derived2);
    function Derived2() {
        _classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Base);
var base;
var derived;
var derived2;
(function(Derived) {
    var h = [
        {
            foo: base,
            basear: derived
        },
        {
            foo: base
        }
    ]; // {foo: Base}[]
    var i = [
        {
            foo: base,
            basear: derived
        },
        {
            foo: derived
        }
    ]; // {foo: Derived}[]
    var j = [
        function() {
            return base;
        },
        function() {
            return derived;
        }
    ]; // { {}: Base }
    var k = [
        function() {
            return base;
        },
        function() {
            return 1;
        }
    ]; // {}[]~
    var l = [
        function() {
            return base;
        },
        function() {
            return null;
        }
    ]; // { (): any }[]
    var m = [
        function() {
            return base;
        },
        function() {
            return derived;
        },
        function() {
            return null;
        }
    ]; // { (): any }[]
    var n = [
        [
            function() {
                return base;
            }
        ],
        [
            function() {
                return derived;
            }
        ]
    ]; // { (): Base }[]
    var o = [
        derived,
        derived2
    ]; // {}[]
    var p = [
        derived,
        derived2,
        base
    ]; // Base[]
    var q = [
        [
            function() {
                return derived2;
            }
        ],
        [
            function() {
                return derived;
            }
        ]
    ]; // {}[]
})(Derived1 || (Derived1 = {
}));
var WithContextualType;
(function(WithContextualType) {
    // no errors
    var a = [
        derived,
        derived2
    ];
    var b = [
        null
    ];
    var c = [];
    var d = [
        function() {
            return derived;
        },
        function() {
            return derived2;
        }
    ];
})(WithContextualType || (WithContextualType = {
}));
function foo(t, u) {
    var a = [
        t,
        t
    ]; // T[]
    var b = [
        t,
        null
    ]; // T[]
    var c = [
        t,
        u
    ]; // {}[]
    var d = [
        t,
        1
    ]; // {}[]
    var e = [
        function() {
            return t;
        },
        function() {
            return u;
        }
    ]; // {}[]
    var f = [
        function() {
            return t;
        },
        function() {
            return u;
        },
        function() {
            return null;
        }
    ]; // { (): any }[]
}
function foo2(t, u) {
    var a = [
        t,
        t
    ]; // T[]
    var b = [
        t,
        null
    ]; // T[]
    var c = [
        t,
        u
    ]; // {}[]
    var d = [
        t,
        1
    ]; // {}[]
    var e = [
        function() {
            return t;
        },
        function() {
            return u;
        }
    ]; // {}[]
    var f = [
        function() {
            return t;
        },
        function() {
            return u;
        },
        function() {
            return null;
        }
    ]; // { (): any }[]
    var g = [
        t,
        base
    ]; // Base[]
    var h = [
        t,
        derived
    ]; // Derived[]
    var i = [
        u,
        base
    ]; // Base[]
    var j = [
        u,
        derived
    ]; // Derived[]
}
function foo3(t, u) {
    var a = [
        t,
        t
    ]; // T[]
    var b = [
        t,
        null
    ]; // T[]
    var c = [
        t,
        u
    ]; // {}[]
    var d = [
        t,
        1
    ]; // {}[]
    var e = [
        function() {
            return t;
        },
        function() {
            return u;
        }
    ]; // {}[]
    var f = [
        function() {
            return t;
        },
        function() {
            return u;
        },
        function() {
            return null;
        }
    ]; // { (): any }[]
    var g = [
        t,
        base
    ]; // Base[]
    var h = [
        t,
        derived
    ]; // Derived[]
    var i = [
        u,
        base
    ]; // Base[]
    var j = [
        u,
        derived
    ]; // Derived[]
}
function foo4(t, u) {
    var a = [
        t,
        t
    ]; // T[]
    var b = [
        t,
        null
    ]; // T[]
    var c = [
        t,
        u
    ]; // BUG 821629
    var d = [
        t,
        1
    ]; // {}[]
    var e = [
        function() {
            return t;
        },
        function() {
            return u;
        }
    ]; // {}[]
    var f = [
        function() {
            return t;
        },
        function() {
            return u;
        },
        function() {
            return null;
        }
    ]; // { (): any }[]
    var g = [
        t,
        base
    ]; // Base[]
    var h = [
        t,
        derived
    ]; // Derived[]
    var i = [
        u,
        base
    ]; // Base[]
    var j = [
        u,
        derived
    ]; // Derived[]
    var k = [
        t,
        u
    ];
} //function foo3<T extends U, U extends Derived>(t: T, u: U) {
 //    var a = [t, t]; // T[]
 //    var b = [t, null]; // T[]
 //    var c = [t, u]; // {}[]
 //    var d = [t, 1]; // {}[]
 //    var e = [() => t, () => u]; // {}[]
 //    var f = [() => t, () => u, () => null]; // { (): any }[]
 //    var g = [t, base]; // Base[]
 //    var h = [t, derived]; // Derived[]
 //    var i = [u, base]; // Base[]
 //    var j = [u, derived]; // Derived[]
 //}
 //function foo4<T extends U, U extends Base>(t: T, u: U) {
 //    var a = [t, t]; // T[]
 //    var b = [t, null]; // T[]
 //    var c = [t, u]; // BUG 821629
 //    var d = [t, 1]; // {}[]
 //    var e = [() => t, () => u]; // {}[]
 //    var f = [() => t, () => u, () => null]; // { (): any }[]
 //    var g = [t, base]; // Base[]
 //    var h = [t, derived]; // Derived[]
 //    var i = [u, base]; // Base[]
 //    var j = [u, derived]; // Derived[]
 //    var k: Base[] = [t, u];
 //}
