//// [superInStaticMembers1.ts]
//// [external.ts]
export class Reflect {
}
export var Baz;
Baz || (Baz = {});
export default class {
};
//// [locals.ts]
super.w(), (()=>{
    var { Reflect  } = {
        Reflect: null
    };
    super.w();
})(), (()=>{
    var [Reflect] = [
        null
    ];
    super.w();
})(), super.w(), super.w(), (()=>{
    let Reflect;
    Reflect || (Reflect = {}), super.w();
})(), (()=>{
    let Reflect;
    Reflect || (Reflect = {}), super.w();
})(), super.w(), super.w(), super.w(), super.w();
export { };
//// [varInContainingScopeStaticField1.ts]
super.w();
export { };
//// [varInContainingScopeStaticField2.ts]
var { Reflect  } = {
    Reflect: null
};
super.w();
export { };
//// [varInContainingScopeStaticField3.ts]
var [Reflect] = [
    null
];
super.w();
export { };
//// [varInContainingScopeStaticBlock1.ts]
export { };
//// [varInContainingScopeStaticBlock2.ts]
var { Reflect  } = {
    Reflect: null
};
export { };
//// [varInContainingScopeStaticBlock3.ts]
var [Reflect] = [
    null
];
export { };
//// [classDeclInContainingScopeStaticField.ts]
super.w();
export { };
//// [classDeclInContainingScopeStaticBlock.ts]
export { };
//// [funcDeclInContainingScopeStaticField.ts]
super.w();
export { };
//// [funcDeclInContainingScopeStaticBlock.ts]
export { };
//// [valueNamespaceInContainingScopeStaticField.ts]
super.w();
export { };
//// [valueNamespaceInContainingScopeStaticBlock.ts]
export { };
//// [enumInContainingScopeStaticField.ts]
var Reflect;
Reflect || (Reflect = {}), super.w();
export { };
//// [enumInContainingScopeStaticBlock.ts]
var Reflect;
Reflect || (Reflect = {});
export { };
//// [constEnumInContainingScopeStaticField.ts]
var Reflect;
Reflect || (Reflect = {}), super.w();
export { };
//// [constEnumInContainingScopeStaticBlock.ts]
var Reflect;
Reflect || (Reflect = {});
export { };
//// [namespaceImportInContainingScopeStaticField.ts]
super.w();
export { };
//// [namespaceImportInContainingScopeStaticBlock.ts]
export { };
//// [namedImportInContainingScopeStaticField.ts]
super.w();
export { };
//// [namedImportInContainingScopeStaticBlock.ts]
export { };
//// [namedImportOfInterfaceInContainingScopeStaticField.ts]
super.w();
export { };
//// [namedImportOfInterfaceInContainingScopeStaticBlock.ts]
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticField.ts]
super.w();
export { };
//// [namedImportOfUninstantiatedNamespaceInContainingScopeStaticBlock.ts]
export { };
//// [namedImportOfConstEnumInContainingScopeStaticField.ts]
super.w();
export { };
//// [namedImportOfConstEnumInContainingScopeStaticBlock.ts]
export { };
//// [typeOnlyNamedImportInContainingScopeStaticField.ts]
super.w();
export { };
//// [typeOnlyNamedImportInContainingScopeStaticBlock.ts]
export { };
//// [defaultImportInContainingScopeStaticField.ts]
super.w();
export { };
//// [defaultImportInContainingScopeStaticBlock.ts]
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticField.ts]
super.w();
export { };
//// [typeOnlyDefaultImportInContainingScopeStaticBlock.ts]
export { };
//// [typeInContainingScopeStaticField.ts]
super.w();
export { };
//// [typeInContainingScopeStaticBlock.ts]
export { };
//// [interfaceInContainingScopeStaticField.ts]
super.w();
export { };
//// [interfaceInContainingScopeStaticBlock.ts]
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticField.ts]
super.w();
export { };
//// [uninstantiatedNamespaceInContainingScopeStaticBlock.ts]
export { };
//// [classExprInContainingScopeStaticField.ts]
super.w();
export { };
//// [classExprInContainingScopeStaticBlock.ts]
export { };
//// [inContainingClassExprStaticField.ts]
export { };
//// [inContainingClassExprStaticBlock.ts]
export { };
//// [funcExprInContainingScopeStaticField.ts]
super.w();
export { };
//// [funcExprInContainingScopeStaticBlock.ts]
export { };
//// [inContainingFuncExprStaticField.ts]
export { };
//// [inContainingFuncExprStaticBlock.ts]
export { };
