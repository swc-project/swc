function _classNameTDZError(name) {
    throw new Error("Class \"" + name + "\" cannot be referenced in computed property keys.");
}
let _staticProp = (_classNameTDZError("C"), C).staticProp, _staticProp1 = (_classNameTDZError("C"), C).staticProp, _staticProp2 = (_classNameTDZError("C"), C).staticProp;
class C {
    get [_staticProp]() {
        return "hello";
    }
    set [_staticProp1](x) {}
    [_staticProp2]() {}
}
C.staticProp = 10;
