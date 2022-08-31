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
    void _get(_get_prototype_of(C), "w", C).call(C),
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
], (()=>{
    var { Reflect  } = {
        Reflect: null
    };
    super.w();
})(), (()=>{
    var [Reflect] = [
        null
    ];
    super.w();
})(), super.w(), super.w(), super.w(), (()=>{
    let Reflect;
    Reflect || (Reflect = {}), super.w();
})(), (()=>{
    let Reflect;
    Reflect || (Reflect = {}), super.w();
})(), super.w(), super.w(), super.w(), super.w();
//// [varInContainingScopeStaticField1.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
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
super.w();
export { };
//// [varInContainingScopeStaticBlock2.ts]
var { Reflect  } = {
    Reflect: null
};
super.w();
export { };
//// [varInContainingScopeStaticBlock3.ts]
var [Reflect] = [
    null
];
super.w();
export { };
//// [classDeclInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [classDeclInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [funcDeclInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [funcDeclInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [valueNamespaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [valueNamespaceInContainingScopeStaticBlock.ts]
super.w();
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
var Reflect;
Reflect || (Reflect = {}), super.w();
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
var Reflect;
Reflect || (Reflect = {}), super.w();
export { };
//// [namespaceImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namespaceImportInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [namedImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [defaultImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [defaultImportInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [typeInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [interfaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [interfaceInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [classExprInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [classExprInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [inContainingClassExprStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
(()=>{
    class C extends B {
    }
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
//// [inContainingClassExprStaticBlock.ts]
super.w();
export { };
//// [funcExprInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [funcExprInContainingScopeStaticBlock.ts]
super.w();
export { };
//// [inContainingFuncExprStaticField.ts]
export { };
//// [inContainingFuncExprStaticBlock.ts]
export { };
