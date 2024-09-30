//// [superInStaticMembers1.ts]
//// [external.ts]
export class Reflect {
}
;
export default class {
}
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
        }({})// collision (es2015-es2021 only)
        ;
        _get(_get_prototype_of(C), "w", C).call(C);
    })(),
    (()=>{
        ;
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
    }({})// collision (es2015-es2021 only)
    ;
    _get(_get_prototype_of(C), "w", C).call(C);
})();
(()=>{
    ;
    _get(_get_prototype_of(C), "w", C).call(C);
})();
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
}(Reflect || {})// collision (es2015-es2021 only)
;
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [enumInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
var Reflect = /*#__PURE__*/ function(Reflect) {
    return Reflect;
}(Reflect || {})// collision (es2015-es2021 only)
;
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [constEnumInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
;
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [constEnumInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
;
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
export { }; // collision (es2015-es2021 only)
//// [namespaceImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { }; // collision (es2015-es2021 only)
//// [namedImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { }; // collision (es2015-es2021 only)
//// [namedImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { }; // collision (es2015-es2021 only)
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { }; // collision (es2015-es2021 only)
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { }; // collision (es2015-es2021 only)
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { }; // no collision
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { }; // no collision
//// [defaultImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { }; // collision (es2015-es2021 only)
//// [defaultImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { }; // collision (es2015-es2021 only)
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { }; // no collision
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { }; // no collision
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
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [interfaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
_get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticField.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C extends B {
}
C._ = _get(_get_prototype_of(C), "w", C).call(C);
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
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
