//// [superInStaticMembers1.ts]
//// [external.ts]
export class Reflect {
}
export var Baz;
Baz || (Baz = {});
export default class {
}
//// [locals.ts]
class C extends B {
    static{
        let Reflect// collision (es2015-es2021 only)
        , Reflect1// collision (es2015-es2021 only)
        ;
        this._ = [
            void super.w(),
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
            void super.w(),
            void super.w(),
            void (Reflect || (Reflect = {}), super.w()),
            void (Reflect1 || (Reflect1 = {}), super.w()),
            void super.w(),
            void super.w(),
            void super.w(),
            void super.w()
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
        super.w();
    }
    static{
        super.w();
    }
    static{
        super.w();
    }
    static{
        let Reflect// collision (es2015-es2021 only)
        ;
        Reflect || (Reflect = {}), super.w();
    }
    static{
        let Reflect// collision (es2015-es2021 only)
        ;
        Reflect || (Reflect = {}), super.w();
    }
    static{
        super.w();
    }
    static{
        super.w();
    }
    static{
        super.w();
    }
    static{
        super.w();
    }
}
export { };
//// [varInContainingScopeStaticField1.ts]
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
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [classDeclInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [funcDeclInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [funcDeclInContainingScopeStaticBlock.ts]
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
var Reflect// collision (es2015-es2021 only)
;
Reflect || (Reflect = {});
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [enumInContainingScopeStaticBlock.ts]
var Reflect// collision (es2015-es2021 only)
;
Reflect || (Reflect = {});
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [constEnumInContainingScopeStaticField.ts]
var Reflect// collision (es2015-es2021 only)
;
Reflect || (Reflect = {});
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [constEnumInContainingScopeStaticBlock.ts]
var Reflect// collision (es2015-es2021 only)
;
Reflect || (Reflect = {});
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
    static{
        this._ = super.w();
    }
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
    static{
        this._ = super.w();
    }
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
    static{
        this._ = super.w();
    }
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
    static{
        this._ = super.w();
    }
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
    static{
        this._ = super.w();
    }
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
    static{
        this._ = super.w();
    }
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
    static{
        this._ = super.w();
    }
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
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [classExprInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [inContainingClassExprStaticField.ts]
export { };
//// [inContainingClassExprStaticBlock.ts]
export { };
//// [funcExprInContainingScopeStaticField.ts]
class C extends B {
    static{
        this._ = super.w();
    }
}
export { };
//// [funcExprInContainingScopeStaticBlock.ts]
class C extends B {
    static{
        super.w();
    }
}
export { };
//// [inContainingFuncExprStaticField.ts]
export { };
//// [inContainingFuncExprStaticBlock.ts]
export { };
