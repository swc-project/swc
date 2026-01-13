//// [superInStaticMembers1.ts]
//// [external.ts]
export class Reflect {
}
export var Baz = /*#__PURE__*/ function(Baz) {
    return Baz;
}({});
export default class {
}
;
//// [locals.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = [
    (()=>{
        var Reflect; // collision (es2015-es2021 only)
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        var { Reflect } = {
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
        let Reflect = /*#__PURE__*/ function(Reflect) {
            return Reflect;
        }({});
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        ; // no collision
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
(()=>{
    var { Reflect } = {
        Reflect: null
    }; // collision (es2015-es2021 only)
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(()=>{
    var [Reflect] = [
        null
    ]; // collision (es2015-es2021 only)
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(()=>{
    var Reflect; // collision (es2015-es2021 only)
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(()=>{
    class Reflect {
    } // collision (es2015-es2021 only)
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(()=>{
    function Reflect() {} // collision (es2015-es2021 only)
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(()=>{
    let Reflect = /*#__PURE__*/ function(Reflect) {
        return Reflect;
    }({});
    _get(_get_prototype_of(C), "w", C).call(C);
})();
_get(_get_prototype_of(C), "w", C).call(C);
_get(_get_prototype_of(C), "w", C).call(C);
_get(_get_prototype_of(C), "w", C).call(C);
(()=>{
    (class Reflect {
    } // no collision
    );
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(()=>{
    (function Reflect() {} // no collision
    );
    _get(_get_prototype_of(C), "w", C).call(C);
})();
export { };
//// [varInContainingScopeStaticField1.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var Reflect = null; // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [varInContainingScopeStaticField2.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var { Reflect } = {
    Reflect: null
}; // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [varInContainingScopeStaticField3.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var [Reflect] = [
    null
]; // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [varInContainingScopeStaticBlock1.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var Reflect = null; // collision (es2015-es2021 only)
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [varInContainingScopeStaticBlock2.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var { Reflect } = {
    Reflect: null
}; // collision (es2015-es2021 only)
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [varInContainingScopeStaticBlock3.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var [Reflect] = [
    null
]; // collision (es2015-es2021 only)
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [classDeclInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class Reflect {
} // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [classDeclInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class Reflect {
} // collision (es2015-es2021 only)
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [funcDeclInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
function Reflect() {} // collision (es2015-es2021 only)
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [funcDeclInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
function Reflect() {} // collision (es2015-es2021 only)
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [valueNamespaceInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [valueNamespaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [enumInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var Reflect = /*#__PURE__*/ function(Reflect) {
    return Reflect;
}(Reflect || {});
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [enumInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var Reflect = /*#__PURE__*/ function(Reflect) {
    return Reflect;
}(Reflect || {});
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [constEnumInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [constEnumInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namespaceImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namespaceImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [defaultImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [defaultImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [typeInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [typeInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [interfaceInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
; // no collision
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [interfaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
; // no collision
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
; // no collision
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
; // no collision
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [classExprInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
(class Reflect {
}); // no collision
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [classExprInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
(class Reflect {
}); // no collision
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [inContainingClassExprStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var _Reflect;
_Reflect = class Reflect {
}, (()=>{
    class C extends B {
    }
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
})(), _Reflect;
export { };
//// [inContainingClassExprStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var _Reflect;
_Reflect = class Reflect {
}, (()=>{
    class C extends B {
    }
    _get(_get_prototype_of(C), "w", C).call(C);
})(), _Reflect;
export { };
//// [funcExprInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
(function Reflect() {}); // no collision
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [funcExprInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
(function Reflect() {}); // no collision
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [inContainingFuncExprStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
(function Reflect() {
    class C extends B {
    }
    C._ = _get(_get_prototype_of(C), "w", C).call(C);
});
export { };
//// [inContainingFuncExprStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
(function Reflect() {
    class C extends B {
    }
    _get(_get_prototype_of(C), "w", C).call(C);
});
export { };
