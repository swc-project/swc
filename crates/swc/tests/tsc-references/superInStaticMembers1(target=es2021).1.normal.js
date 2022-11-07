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
        _get(_get_prototype_of(C), "w", C).call(C);
    })()
};
var __1 = {
    writable: true,
    value: (()=>{
        var [Reflect] = [
            null
        ]; // collision (es2015-es2021 only)
        _get(_get_prototype_of(C), "w", C).call(C);
    })()
};
var __2 = {
    writable: true,
    value: (()=>{
        var Reflect; // collision (es2015-es2021 only)
        _get(_get_prototype_of(C), "w", C).call(C);
    })()
};
var __3 = {
    writable: true,
    value: (()=>{
        class Reflect {
        } // collision (es2015-es2021 only)
        _get(_get_prototype_of(C), "w", C).call(C);
    })()
};
var __4 = {
    writable: true,
    value: (()=>{
        function Reflect() {} // collision (es2015-es2021 only)
        _get(_get_prototype_of(C), "w", C).call(C);
    })()
};
var __5 = {
    writable: true,
    value: (()=>{
        let Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        _get(_get_prototype_of(C), "w", C).call(C);
    })()
};
var __6 = {
    writable: true,
    value: (()=>{
        let Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        _get(_get_prototype_of(C), "w", C).call(C);
    })()
};
var __7 = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
    })()
};
var __8 = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
    })()
};
var __9 = {
    writable: true,
    value: (()=>{
        (class Reflect {
        } // no collision
        );
        _get(_get_prototype_of(C), "w", C).call(C);
    })()
};
var __10 = {
    writable: true,
    value: (()=>{
        (function Reflect() {} // no collision
        );
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var Reflect = null; // collision (es2015-es2021 only)
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
    })()
};
export { };
//// [varInContainingScopeStaticBlock2.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var { Reflect  } = {
    Reflect: null
}; // collision (es2015-es2021 only)
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
    })()
};
export { };
//// [varInContainingScopeStaticBlock3.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var [Reflect] = [
    null
]; // collision (es2015-es2021 only)
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class Reflect {
} // collision (es2015-es2021 only)
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
function Reflect() {} // collision (es2015-es2021 only)
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
(class Reflect {
}); // no collision
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
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
                _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
(function Reflect() {}); // no collision
class C extends B {
}
var __ = {
    writable: true,
    value: (()=>{
        _get(_get_prototype_of(C), "w", C).call(C);
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
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
(function Reflect() {
    class C extends B {
    }
    var __ = {
        writable: true,
        value: (()=>{
            _get(_get_prototype_of(C), "w", C).call(C);
        })()
    };
});
export { };
