//// [superInStaticMembers1.ts]
//// [external.ts]
export class Reflect {
}
export default class {
}
//// [locals.ts]
var __ = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), __4 = new WeakMap(), __5 = new WeakMap(), __6 = new WeakMap(), __7 = new WeakMap(), __8 = new WeakMap(), __9 = new WeakMap(), __10 = new WeakMap(), __11 = new WeakMap(), __12 = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = [
        (()=>{
            var Reflect; // collision (es2015-es2021 only)
            super.w();
        })(),
        (()=>{
            var { Reflect } = {
                Reflect: null
            }; // collision (es2015-es2021 only)
            super.w();
        })(),
        (()=>{
            var [Reflect] = [
                null
            ]; // collision (es2015-es2021 only)
            super.w();
        })(),
        (()=>{
            class Reflect {
            } // collision (es2015-es2021 only)
            super.w();
        })(),
        (()=>{
            function Reflect() {} // collision (es2015-es2021 only)
            super.w();
        })(),
        (()=>{
            let Reflect = /*#__PURE__*/ function(Reflect) {
                return Reflect;
            }({})// collision (es2015-es2021 only)
            ;
            super.w();
        })(),
        (()=>{
            super.w();
        })(),
        (()=>{
            super.w();
        })(),
        (()=>{
            ; // no collision
            super.w();
        })(),
        (()=>{
            (class Reflect {
            }); // no collision
            super.w();
        })(),
        (()=>{
            (function Reflect() {}); // no collision
            super.w();
        })()
    ]
});
__2.set(C, {
    writable: true,
    value: (()=>{
        var { Reflect } = {
            Reflect: null
        }; // collision (es2015-es2021 only)
        super.w();
    })()
});
__3.set(C, {
    writable: true,
    value: (()=>{
        var [Reflect] = [
            null
        ]; // collision (es2015-es2021 only)
        super.w();
    })()
});
__4.set(C, {
    writable: true,
    value: (()=>{
        var Reflect; // collision (es2015-es2021 only)
        super.w();
    })()
});
__5.set(C, {
    writable: true,
    value: (()=>{
        class Reflect {
        } // collision (es2015-es2021 only)
        super.w();
    })()
});
__6.set(C, {
    writable: true,
    value: (()=>{
        function Reflect() {} // collision (es2015-es2021 only)
        super.w();
    })()
});
__7.set(C, {
    writable: true,
    value: (()=>{
        let Reflect = /*#__PURE__*/ function(Reflect) {
            return Reflect;
        }({})// collision (es2015-es2021 only)
        ;
        super.w();
    })()
});
__8.set(C, {
    writable: true,
    value: super.w()
});
__9.set(C, {
    writable: true,
    value: super.w()
});
__10.set(C, {
    writable: true,
    value: super.w()
});
__11.set(C, {
    writable: true,
    value: (()=>{
        (class Reflect {
        } // no collision
        );
        super.w();
    })()
});
__12.set(C, {
    writable: true,
    value: (()=>{
        (function Reflect() {} // no collision
        );
        super.w();
    })()
});
export { };
//// [varInContainingScopeStaticField1.ts]
var __ = new WeakMap();
var Reflect = null; // collision (es2015-es2021 only)
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [varInContainingScopeStaticField2.ts]
var __ = new WeakMap();
var { Reflect } = {
    Reflect: null
}; // collision (es2015-es2021 only)
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [varInContainingScopeStaticField3.ts]
var __ = new WeakMap();
var [Reflect] = [
    null
]; // collision (es2015-es2021 only)
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [varInContainingScopeStaticBlock1.ts]
var __ = new WeakMap();
var Reflect = null; // collision (es2015-es2021 only)
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [varInContainingScopeStaticBlock2.ts]
var __ = new WeakMap();
var { Reflect } = {
    Reflect: null
}; // collision (es2015-es2021 only)
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [varInContainingScopeStaticBlock3.ts]
var __ = new WeakMap();
var [Reflect] = [
    null
]; // collision (es2015-es2021 only)
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [classDeclInContainingScopeStaticField.ts]
var __ = new WeakMap();
class Reflect {
} // collision (es2015-es2021 only)
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [classDeclInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class Reflect {
} // collision (es2015-es2021 only)
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [funcDeclInContainingScopeStaticField.ts]
var __ = new WeakMap();
function Reflect() {} // collision (es2015-es2021 only)
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [funcDeclInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
function Reflect() {} // collision (es2015-es2021 only)
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [valueNamespaceInContainingScopeStaticField.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [valueNamespaceInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [enumInContainingScopeStaticField.ts]
var __ = new WeakMap();
var Reflect = /*#__PURE__*/ function(Reflect) {
    return Reflect;
}(Reflect || {})// collision (es2015-es2021 only)
;
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [enumInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
var Reflect = /*#__PURE__*/ function(Reflect) {
    return Reflect;
}(Reflect || {})// collision (es2015-es2021 only)
;
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [constEnumInContainingScopeStaticField.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [constEnumInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [namespaceImportInContainingScopeStaticField.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // collision (es2015-es2021 only)
//// [namespaceImportInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // collision (es2015-es2021 only)
//// [namedImportInContainingScopeStaticField.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // collision (es2015-es2021 only)
//// [namedImportInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // collision (es2015-es2021 only)
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // collision (es2015-es2021 only)
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // collision (es2015-es2021 only)
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // no collision
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // no collision
//// [defaultImportInContainingScopeStaticField.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // collision (es2015-es2021 only)
//// [defaultImportInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // collision (es2015-es2021 only)
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { }; // no collision
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { }; // no collision
//// [typeInContainingScopeStaticField.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [typeInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [interfaceInContainingScopeStaticField.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [interfaceInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticField.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [classExprInContainingScopeStaticField.ts]
var __ = new WeakMap();
(class Reflect {
}); // no collision
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [classExprInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
(class Reflect {
}); // no collision
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [inContainingClassExprStaticField.ts]
var __ = new WeakMap(), Reflect;
Reflect = class Reflect {
}, __.set(Reflect, {
    writable: true,
    value: (()=>{
        var __ = new WeakMap();
        class C extends B {
        }
        __.set(C, {
            writable: true,
            value: C._ = super.w()
        });
    })()
}), Reflect;
export { };
//// [inContainingClassExprStaticBlock.ts]
var __ = new WeakMap(), Reflect;
Reflect = class Reflect {
}, __.set(Reflect, {
    writable: true,
    value: (()=>{
        var __ = new WeakMap();
        class C extends B {
        }
        __.set(C, {
            writable: true,
            value: super.w()
        });
    })()
}), Reflect;
export { };
//// [funcExprInContainingScopeStaticField.ts]
var __ = new WeakMap();
(function Reflect() {}); // no collision
class C extends B {
}
__.set(C, {
    writable: true,
    value: C._ = super.w()
});
export { };
//// [funcExprInContainingScopeStaticBlock.ts]
var __ = new WeakMap();
(function Reflect() {}); // no collision
class C extends B {
}
__.set(C, {
    writable: true,
    value: super.w()
});
export { };
//// [inContainingFuncExprStaticField.ts]
(function Reflect() {
    var __ = new WeakMap();
    class C extends B {
    }
    __.set(C, {
        writable: true,
        value: C._ = super.w()
    });
});
export { };
//// [inContainingFuncExprStaticBlock.ts]
(function Reflect() {
    var __ = new WeakMap();
    class C extends B {
    }
    __.set(C, {
        writable: true,
        value: super.w()
    });
});
export { };
