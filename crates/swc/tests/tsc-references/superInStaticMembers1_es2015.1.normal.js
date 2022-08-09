// @target: es5, es2015, es2021, es2022, esnext
// @noTypesAndSymbols: true
// @filename: external.ts
export class Reflect {
}
export var Baz;
(function(Baz) {})(Baz || (Baz = {}));
export default class {
};
// @filename: locals.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
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
var __ = {
    writable: true,
    value: (()=>{
        var { Reflect  } = {
            Reflect: null
        }; // collision (es2015-es2021 only)
        super.w();
    })()
};
var __1 = {
    writable: true,
    value: (()=>{
        var [Reflect] = [
            null
        ]; // collision (es2015-es2021 only)
        super.w();
    })()
};
var __2 = {
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
export { };
// @filename: varInContainingScopeStaticField1.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var Reflect = null; // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: varInContainingScopeStaticField2.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var { Reflect  } = {
    Reflect: null
}; // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: varInContainingScopeStaticField3.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var [Reflect] = [
    null
]; // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: varInContainingScopeStaticBlock1.ts
var Reflect = null; // collision (es2015-es2021 only)
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: varInContainingScopeStaticBlock2.ts
var { Reflect  } = {
    Reflect: null
}; // collision (es2015-es2021 only)
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: varInContainingScopeStaticBlock3.ts
var [Reflect] = [
    null
]; // collision (es2015-es2021 only)
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: classDeclInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class Reflect {
} // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: classDeclInContainingScopeStaticBlock.ts
class Reflect {
} // collision (es2015-es2021 only)
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: funcDeclInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
function Reflect() {} // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: funcDeclInContainingScopeStaticBlock.ts
function Reflect() {} // collision (es2015-es2021 only)
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: valueNamespaceInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: valueNamespaceInContainingScopeStaticBlock.ts
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: enumInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: enumInContainingScopeStaticBlock.ts
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: constEnumInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: constEnumInContainingScopeStaticBlock.ts
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: namespaceImportInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: namespaceImportInContainingScopeStaticBlock.ts
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: namedImportInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: namedImportInContainingScopeStaticBlock.ts
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: namedImportOfInterfaceInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: namedImportOfInterfaceInContainingScopeStaticBlock.ts
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: namedImportOfConstEnumInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: namedImportOfConstEnumInContainingScopeStaticBlock.ts
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: typeOnlyNamedImportInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: typeOnlyNamedImportInContainingScopeStaticBlock.ts
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: defaultImportInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: defaultImportInContainingScopeStaticBlock.ts
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: typeOnlyDefaultImportInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: typeOnlyDefaultImportInContainingScopeStaticBlock.ts
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: typeInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: typeInContainingScopeStaticBlock.ts
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: interfaceInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: interfaceInContainingScopeStaticBlock.ts
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: uninstantiatedNamespaceInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: uninstantiatedNamespaceInContainingScopeStaticBlock.ts
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: classExprInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
(class Reflect {
}); // no collision
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: classExprInContainingScopeStaticBlock.ts
(class Reflect {
}); // no collision
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: inContainingClassExprStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var _Reflect, __;
_Reflect = class Reflect {
}, __ = {
    writable: true,
    value: (()=>{
        class C extends B {
        }
        C._ = _get(_get_prototype_of(C), "w", C).call(C);
    })()
}, _Reflect;
export { };
// @filename: inContainingClassExprStaticBlock.ts
var _Reflect, __;
_Reflect = class Reflect {
}, __ = {
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
}, _Reflect;
export { };
// @filename: funcExprInContainingScopeStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
(function Reflect() {}); // no collision
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
// @filename: funcExprInContainingScopeStaticBlock.ts
(function Reflect() {}); // no collision
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
// @filename: inContainingFuncExprStaticField.ts
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
(function Reflect() {
    class C extends B {
    }
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
});
export { };
// @filename: inContainingFuncExprStaticBlock.ts
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
export { };
