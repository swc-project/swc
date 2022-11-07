//// [superInStaticMembers1.ts]
//// [external.ts]
export class Reflect {
}
export var Baz;
Baz || (Baz = {});
export default class {
}
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
    void _get(_get_prototype_of(C), "w", C).call(C)
], (()=>{
    var { Reflect  } = {
        Reflect: null
    };
    _get(_get_prototype_of(C), "w", C).call(C);
})(), (()=>{
    var [Reflect] = [
        null
    ];
    _get(_get_prototype_of(C), "w", C).call(C);
})(), _get(_get_prototype_of(C), "w", C).call(C), _get(_get_prototype_of(C), "w", C).call(C), _get(_get_prototype_of(C), "w", C).call(C), (()=>{
    let Reflect;
    Reflect || (Reflect = {}), _get(_get_prototype_of(C), "w", C).call(C);
})(), (()=>{
    let Reflect;
    Reflect || (Reflect = {}), _get(_get_prototype_of(C), "w", C).call(C);
})(), _get(_get_prototype_of(C), "w", C).call(C), _get(_get_prototype_of(C), "w", C).call(C), _get(_get_prototype_of(C), "w", C).call(C), _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticBlock2.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var { Reflect  } = {
    Reflect: null
};
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticBlock3.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var [Reflect] = [
    null
];
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [classDeclInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [classDeclInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [funcDeclInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [funcDeclInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [valueNamespaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [valueNamespaceInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
Reflect || (Reflect = {});
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
Reflect || (Reflect = {});
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [namespaceImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namespaceImportInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [defaultImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [defaultImportInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [typeInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [interfaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [interfaceInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [uninstantiatedNamespaceInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [classExprInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [classExprInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [inContainingClassExprStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
(()=>{
    class C extends B {
    }
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
//// [inContainingClassExprStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
(()=>{
    class C extends B {
    }
    _get(_get_prototype_of(C), "w", C).call(C);
})();
//// [funcExprInContainingScopeStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [funcExprInContainingScopeStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [inContainingFuncExprStaticField.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
//// [inContainingFuncExprStaticBlock.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
