//// [superInStaticMembers1.ts]
//// [external.ts]
export class Reflect {
}
export var Baz;
(function(Baz) {})(Baz || (Baz = {}));
export default class {
}
//// [locals.ts]
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
    })()
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
        } // no collision
        );
        super.w();
    })()
};
var __10 = {
    writable: true,
    value: (()=>{
        (function Reflect() {} // no collision
        );
        super.w();
    })()
};
export { };
//// [varInContainingScopeStaticField1.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var Reflect = null; // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [varInContainingScopeStaticField2.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var { Reflect  } = {
    Reflect: null
}; // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [varInContainingScopeStaticField3.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var [Reflect] = [
    null
]; // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [varInContainingScopeStaticBlock1.ts]
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
//// [varInContainingScopeStaticBlock2.ts]
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
//// [varInContainingScopeStaticBlock3.ts]
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
//// [classDeclInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class Reflect {
} // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [classDeclInContainingScopeStaticBlock.ts]
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
//// [funcDeclInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
function Reflect() {} // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [funcDeclInContainingScopeStaticBlock.ts]
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
//// [valueNamespaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [valueNamespaceInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
//// [enumInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [enumInContainingScopeStaticBlock.ts]
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
//// [constEnumInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [constEnumInContainingScopeStaticBlock.ts]
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
//// [namespaceImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namespaceImportInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
//// [namedImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
//// [defaultImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [defaultImportInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
//// [typeInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [typeInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
//// [interfaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [interfaceInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        super.w();
    })()
};
export { };
//// [classExprInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
(class Reflect {
}); // no collision
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [classExprInContainingScopeStaticBlock.ts]
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
//// [inContainingClassExprStaticField.ts]
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
//// [inContainingClassExprStaticBlock.ts]
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
//// [funcExprInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
(function Reflect() {}); // no collision
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [funcExprInContainingScopeStaticBlock.ts]
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
//// [inContainingFuncExprStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
(function Reflect() {
    class C extends B {
    }
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
});
export { };
//// [inContainingFuncExprStaticBlock.ts]
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
