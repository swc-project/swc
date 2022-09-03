//// [superInStaticMembers1.ts]
//// [external.ts]
export class Reflect {
}
export var Baz;
Baz || (Baz = {});
export default class {
};
//// [locals.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = [
    (()=>{
        var Reflect;
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        var { Reflect  } = {
            Reflect: null
        };
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        var [Reflect] = [
            null
        ];
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C),
    (()=>{
        let Reflect;
        Reflect || (Reflect = {}), _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        let Reflect;
        Reflect || (Reflect = {}), _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C), 
];
var __ = {
    writable: !0,
    value: (()=>{
        var { Reflect  } = {
            Reflect: null
        };
        super.w();
    })()
}, __1 = {
    writable: !0,
    value: (()=>{
        var [Reflect] = [
            null
        ];
        super.w();
    })()
}, __2 = {
    writable: !0,
    value: (()=>{
        var Reflect;
        super.w();
    })()
}, __3 = {
    writable: !0,
    value: void super.w()
}, __4 = {
    writable: !0,
    value: void super.w()
}, __5 = {
    writable: !0,
    value: (()=>{
        let Reflect;
        Reflect || (Reflect = {}), super.w();
    })()
}, __6 = {
    writable: !0,
    value: (()=>{
        let Reflect;
        Reflect || (Reflect = {}), super.w();
    })()
}, __7 = {
    writable: !0,
    value: void super.w()
}, __8 = {
    writable: !0,
    value: void super.w()
}, __9 = {
    writable: !0,
    value: void super.w()
}, __10 = {
    writable: !0,
    value: void super.w()
};
//// [varInContainingScopeStaticField1.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var Reflect = null;
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticField2.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var { Reflect  } = {
    Reflect: null
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticField3.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var [Reflect] = [
    null
];
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticBlock1.ts]
var Reflect = null;
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [varInContainingScopeStaticBlock2.ts]
var { Reflect  } = {
    Reflect: null
};
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [varInContainingScopeStaticBlock3.ts]
var [Reflect] = [
    null
];
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [classDeclInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class Reflect {
}
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [classDeclInContainingScopeStaticBlock.ts]
class Reflect {
}
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [funcDeclInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
function Reflect() {}
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [funcDeclInContainingScopeStaticBlock.ts]
function Reflect() {}
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [valueNamespaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [valueNamespaceInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [enumInContainingScopeStaticField.ts]
var Reflect;
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
Reflect || (Reflect = {});
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [enumInContainingScopeStaticBlock.ts]
Reflect || (Reflect = {});
class C extends B {
}
var Reflect, __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [constEnumInContainingScopeStaticField.ts]
var Reflect;
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
Reflect || (Reflect = {});
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [constEnumInContainingScopeStaticBlock.ts]
Reflect || (Reflect = {});
class C extends B {
}
var Reflect, __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [namespaceImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namespaceImportInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [namedImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [defaultImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [defaultImportInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [typeInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [interfaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [interfaceInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [classExprInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [classExprInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [inContainingClassExprStaticField.ts]
var _Reflect, __;
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
_Reflect = class {
}, __ = {
    writable: !0,
    value: (()=>{
        class C extends B {
        }
        C._ = _get(_get_prototype_of(C), "w", C).call(C);
    })()
};
//// [inContainingClassExprStaticBlock.ts]
var _Reflect, __;
_Reflect = class {
}, __ = {
    writable: !0,
    value: (()=>{
        var __ = {
            writable: !0,
            value: void super.w()
        };
    })()
};
export { };
//// [funcExprInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [funcExprInContainingScopeStaticBlock.ts]
class C extends B {
}
var __ = {
    writable: !0,
    value: void super.w()
};
export { };
//// [inContainingFuncExprStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
//// [inContainingFuncExprStaticBlock.ts]
export { };
