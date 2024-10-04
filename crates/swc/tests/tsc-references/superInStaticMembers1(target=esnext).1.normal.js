//// [superInStaticMembers1.ts]
//// [external.ts]
export class Reflect {
}
;
export default class {
}
//// [locals.ts]
class C extends B {
    static{
        this._ = [
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
                ;
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
        ];
    }
    static{
        var { Reflect } = {
            Reflect: null
        }; // collision (es2015-es2021 only)
        super.w();
    }
    static{
        var [Reflect] = [
            null
        ]; // collision (es2015-es2021 only)
        super.w();
    }
    static{
        var Reflect; // collision (es2015-es2021 only)
        super.w();
    }
    static{
        class Reflect {
        } // collision (es2015-es2021 only)
        super.w();
    }
    static{
        function Reflect() {} // collision (es2015-es2021 only)
        super.w();
    }
    static{
        let Reflect = /*#__PURE__*/ function(Reflect) {
            return Reflect;
        }({})// collision (es2015-es2021 only)
        ;
        super.w();
    }
    static{
        ;
        super.w();
    }
    static{
        super.w();
    }
    static{
        super.w();
    }
    static{
        (class Reflect {
        } // no collision
        );
        super.w();
    }
    static{
        (function Reflect() {} // no collision
        );
        super.w();
    }
}
export { };
//// [varInContainingScopeStaticField1.ts]
var Reflect = null; // collision (es2015-es2021 only)
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [varInContainingScopeStaticField2.ts]
var { Reflect } = {
    Reflect: null
}; // collision (es2015-es2021 only)
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [varInContainingScopeStaticField3.ts]
var [Reflect] = [
    null
]; // collision (es2015-es2021 only)
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [varInContainingScopeStaticBlock1.ts]
var Reflect = null; // collision (es2015-es2021 only)
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [varInContainingScopeStaticBlock2.ts]
var { Reflect } = {
    Reflect: null
}; // collision (es2015-es2021 only)
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [varInContainingScopeStaticBlock3.ts]
var [Reflect] = [
    null
]; // collision (es2015-es2021 only)
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [classDeclInContainingScopeStaticField.ts]
class Reflect {
} // collision (es2015-es2021 only)
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [classDeclInContainingScopeStaticBlock.ts]
class Reflect {
} // collision (es2015-es2021 only)
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [funcDeclInContainingScopeStaticField.ts]
function Reflect() {} // collision (es2015-es2021 only)
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [funcDeclInContainingScopeStaticBlock.ts]
function Reflect() {} // collision (es2015-es2021 only)
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [valueNamespaceInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [valueNamespaceInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [enumInContainingScopeStaticField.ts]
var Reflect = /*#__PURE__*/ function(Reflect) {
    return Reflect;
}(Reflect || {})// collision (es2015-es2021 only)
;
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [enumInContainingScopeStaticBlock.ts]
var Reflect = /*#__PURE__*/ function(Reflect) {
    return Reflect;
}(Reflect || {})// collision (es2015-es2021 only)
;
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [constEnumInContainingScopeStaticField.ts]
;
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [constEnumInContainingScopeStaticBlock.ts]
;
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [namespaceImportInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { }; // collision (es2015-es2021 only)
//// [namespaceImportInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { }; // collision (es2015-es2021 only)
//// [namedImportInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { }; // collision (es2015-es2021 only)
//// [namedImportInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { }; // collision (es2015-es2021 only)
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { }; // collision (es2015-es2021 only, not a type-only import)
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { }; // collision (es2015-es2021 only)
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { }; // collision (es2015-es2021 only)
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { }; // no collision
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { }; // no collision
//// [defaultImportInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { }; // collision (es2015-es2021 only)
//// [defaultImportInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { }; // collision (es2015-es2021 only)
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { }; // no collision
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { }; // no collision
//// [typeInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [typeInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [interfaceInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [interfaceInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [classExprInContainingScopeStaticField.ts]
(class Reflect {
}); // no collision
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [classExprInContainingScopeStaticBlock.ts]
(class Reflect {
}); // no collision
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [inContainingClassExprStaticField.ts]
(class Reflect {
    static{
        class C extends B {
            static{
                this._ = super.w();
            }
        }
    }
});
export { };
//// [inContainingClassExprStaticBlock.ts]
(class Reflect {
    static{
        class C extends B {
            static{
                super.w();
            }
        }
    }
});
export { };
//// [funcExprInContainingScopeStaticField.ts]
(function Reflect() {}); // no collision
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [funcExprInContainingScopeStaticBlock.ts]
(function Reflect() {}); // no collision
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [inContainingFuncExprStaticField.ts]
(function Reflect() {
    class C extends B {
        static{
            this._ = super.w();
        }
    }
});
export { };
//// [inContainingFuncExprStaticBlock.ts]
(function Reflect() {
    class C extends B {
        static{
            super.w();
        }
    }
});
export { };
