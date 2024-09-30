//// [superInStaticMembers1.ts]
//// [external.ts]
export class Reflect {
}
export default class {
}
//// [locals.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = [
    void _get(_get_prototype_of(C), "w", C).call(C),
    (()=>{
        var { Reflect } = {
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
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C),
    void _get(_get_prototype_of(C), "w", C).call(C)
], (()=>{
    var { Reflect } = {
        Reflect: null
    };
    _get(_get_prototype_of(C), "w", C).call(C);
})(), (()=>{
    var [Reflect] = [
        null
    ];
    _get(_get_prototype_of(C), "w", C).call(C);
})(), _get(_get_prototype_of(C), "w", C).call(C), _get(_get_prototype_of(C), "w", C).call(C), _get(_get_prototype_of(C), "w", C).call(C), _get(_get_prototype_of(C), "w", C).call(C), _get(_get_prototype_of(C), "w", C).call(C), _get(_get_prototype_of(C), "w", C).call(C), _get(_get_prototype_of(C), "w", C).call(C), _get(_get_prototype_of(C), "w", C).call(C), _get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticField1.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticField2.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var { Reflect } = {
    Reflect: null
};
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticField3.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var [Reflect] = [
    null
];
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticBlock1.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticBlock2.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var { Reflect } = {
    Reflect: null
};
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [varInContainingScopeStaticBlock3.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var [Reflect] = [
    null
];
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [classDeclInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [classDeclInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [funcDeclInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [funcDeclInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [valueNamespaceInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [valueNamespaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [enumInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [enumInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [constEnumInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [constEnumInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [namespaceImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namespaceImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [defaultImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [defaultImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [typeInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [typeInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [interfaceInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [interfaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [uninstantiatedNamespaceInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [classExprInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [classExprInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [inContainingClassExprStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
(()=>{
    class C extends B {
    }
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})();
//// [inContainingClassExprStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
(()=>{
    class C extends B {
    }
    _get(_get_prototype_of(C), "w", C).call(C);
})();
//// [funcExprInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
//// [funcExprInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
//// [inContainingFuncExprStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
//// [inContainingFuncExprStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
