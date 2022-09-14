//// [superInStaticMembers1.ts]
//// [external.ts]
export class Reflect {
}
export var Baz;
(function(Baz) {})(Baz || (Baz = {}));
export default class {
}
//// [locals.ts]
class C extends B {
    static _ = [
        (()=>{
            var Reflect; // collision (es2015-es2021 only)
            super.w();
        })(),
        (()=>{
            var { Reflect  } = {
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
            let Reflect// collision (es2015-es2021 only)
            ;
            (function(Reflect) {})(Reflect || (Reflect = {}));
            super.w();
        })(),
        (()=>{
            let Reflect// collision (es2015-es2021 only)
            ;
            (function(Reflect) {})(Reflect || (Reflect = {}));
            super.w();
        })(),
        (()=>{
            super.w();
        })(),
        (()=>{
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
        })(), 
    ];
    static{
        var { Reflect  } = {
            Reflect: null
        }; // collision (es2015-es2021 only)
        super.w();
    }
    static{
        var [Reflect1] = [
            null
        ]; // collision (es2015-es2021 only)
        super.w();
    }
    static{
        var Reflect2; // collision (es2015-es2021 only)
        super.w();
    }
    static{
        class Reflect3 {
        } // collision (es2015-es2021 only)
        super.w();
    }
    static{
        function Reflect4() {} // collision (es2015-es2021 only)
        super.w();
    }
    static{
        let Reflect5// collision (es2015-es2021 only)
        ;
        (function(Reflect5) {})(Reflect5 || (Reflect5 = {}));
        super.w();
    }
    static{
        let Reflect6// collision (es2015-es2021 only)
        ;
        (function(Reflect6) {})(Reflect6 || (Reflect6 = {}));
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
    static _ = super.w();
}
export { };
//// [varInContainingScopeStaticField2.ts]
var { Reflect  } = {
    Reflect: null
}; // collision (es2015-es2021 only)
class C extends B {
    static _ = super.w();
}
export { };
//// [varInContainingScopeStaticField3.ts]
var [Reflect] = [
    null
]; // collision (es2015-es2021 only)
class C extends B {
    static _ = super.w();
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
var { Reflect  } = {
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
    static _ = super.w();
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
    static _ = super.w();
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
    static _ = super.w();
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
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
    static _ = super.w();
}
export { };
//// [enumInContainingScopeStaticBlock.ts]
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [constEnumInContainingScopeStaticField.ts]
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
    static _ = super.w();
}
export { };
//// [constEnumInContainingScopeStaticBlock.ts]
var Reflect// collision (es2015-es2021 only)
;
(function(Reflect) {})(Reflect || (Reflect = {}));
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [namespaceImportInContainingScopeStaticField.ts]
class C extends B {
    static _ = super.w();
}
export { };
//// [namespaceImportInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [namedImportInContainingScopeStaticField.ts]
class C extends B {
    static _ = super.w();
}
export { };
//// [namedImportInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
class C extends B {
    static _ = super.w();
}
export { };
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
class C extends B {
    static _ = super.w();
}
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
class C extends B {
    static _ = super.w();
}
export { };
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
class C extends B {
    static _ = super.w();
}
export { };
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [defaultImportInContainingScopeStaticField.ts]
class C extends B {
    static _ = super.w();
}
export { };
//// [defaultImportInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
class C extends B {
    static _ = super.w();
}
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [typeInContainingScopeStaticField.ts]
class C extends B {
    static _ = super.w();
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
    static _ = super.w();
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
    static _ = super.w();
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
    static _ = super.w();
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
            static _ = super.w();
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
    static _ = super.w();
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
        static _ = super.w();
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
