import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var _Reflect, __, _Reflect1, __1;
// @target: es5, es2015, es2021, es2022, esnext
// @noTypesAndSymbols: true
// @filename: external.ts
export class Reflect {
}
export var Baz;
(function(Baz) {})(Baz || (Baz = {}));
class _class {
}
export { _class as default };
class C extends B {
}
C._ = [
    (()=>{
        var Reflect; // collision (es2015-es2021 only)
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        var { Reflect  } = {
            Reflect: null
        }; // collision (es2015-es2021 only)
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        var [Reflect] = [
            null
        ]; // collision (es2015-es2021 only)
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        class Reflect {
        } // collision (es2015-es2021 only)
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        function Reflect() {} // collision (es2015-es2021 only)
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        let Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        let Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        ;
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        (class Reflect {
        }); // no collision
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        (function Reflect() {}); // no collision
        _get(_get_prototype_of(C), "w", C).call(C);
    })(), 
];
var __2 = {
    writable: true,
    value: (()=>{
        var { Reflect  } = {
            Reflect: null
        }; // collision (es2015-es2021 only)
        super.w();
    })()
};
var __11 = {
    writable: true,
    value: (()=>{
        var [Reflect] = [
            null
        ]; // collision (es2015-es2021 only)
        super.w();
    })()
};
var __21 = {
    writable: true,
    value: (()=>{
        var Reflect; // collision (es2015-es2021 only)
        super.w();
    })()
};
var __3 = {
    writable: true,
    value: (()=>{
        class Reflect {
        } // collision (es2015-es2021 only)
        super.w();
    })()
};
var __4 = {
    writable: true,
    value: (()=>{
        function Reflect() {} // collision (es2015-es2021 only)
        super.w();
    })()
};
var __5 = {
    writable: true,
    value: (()=>{
        let Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        super.w();
    })()
};
var __6 = {
    writable: true,
    value: (()=>{
        let Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        super.w();
    })()
};
var __7 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
var __8 = {
    writable: true,
    value: (()=>{
        ;
        super.w();
    })()
};
var __9 = {
    writable: true,
    value: (()=>{
        (class Reflect {
        }) // no collision
        ;
        super.w();
    })()
};
var __10 = {
    writable: true,
    value: (()=>{
        (function Reflect() {}) // no collision
        ;
        super.w();
    })()
};
var Reflect = null; // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
var { Reflect  } = {
    Reflect: null
}; // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
var [Reflect] = [
    null
]; // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
var Reflect = null; // collision (es2015-es2021 only)
class C extends B {
}
var __12 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
var { Reflect  } = {
    Reflect: null
}; // collision (es2015-es2021 only)
class C extends B {
}
var __13 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
var [Reflect] = [
    null
]; // collision (es2015-es2021 only)
class C extends B {
}
var __14 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
class Reflect {
} // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
class Reflect {
} // collision (es2015-es2021 only)
class C extends B {
}
var __15 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
function Reflect() {} // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
function Reflect() {} // collision (es2015-es2021 only)
class C extends B {
}
var __16 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
class C extends B {
}
var __17 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
}
var __18 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
}
var __19 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
class C extends B {
}
var __20 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
class C extends B {
}
var __22 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
class C extends B {
}
var __23 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
class C extends B {
}
var __24 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
class C extends B {
}
var __25 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
class C extends B {
}
var __26 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
class C extends B {
}
var __27 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
class C extends B {
}
var __28 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
class C extends B {
}
var __29 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
class C extends B {
}
var __30 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
class C extends B {
}
var __31 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
(class Reflect {
}); // no collision
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
(class Reflect {
}); // no collision
class C extends B {
}
var __32 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
_Reflect = class Reflect {
}, __ = {
    writable: true,
    value: (()=>{
        class C extends B {
        }
        C._ = _get(_get_prototype_of(C), "w", C).call(C);
    })()
}, _Reflect;
_Reflect1 = class Reflect {
}, __1 = {
    writable: true,
    value: (()=>{
        class C extends B {
        }
        var __ = {
            writable: true,
            value: (()=>{
                super.w();
            })()
        };
    })()
}, _Reflect1;
(function Reflect() {}); // no collision
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
(function Reflect() {}); // no collision
class C extends B {
}
var __33 = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
(function Reflect() {
    class C extends B {
    }
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
});
(function Reflect() {
    class C extends B {
    }
    var __ = {
        writable: true,
        value: (()=>{
            super.w();
        })()
    };
});
