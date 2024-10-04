//// [heterogeneousArrayLiterals.ts]
// type of an array is the best common type of its elements (plus its contextual type if it exists)
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
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
    {},
    1
]; // {}[]
var e = [
    {},
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
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived() {
        _class_call_check(this, Derived);
        return _call_super(this, Derived, arguments);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _call_super(this, Derived2, arguments);
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
})(Derived || (Derived = {}));
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
})(WithContextualType || (WithContextualType = {}));
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
var WithContextualType;
