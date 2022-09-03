//// [emitClassDeclarationWithGetterSetterInES6.ts]
class C {
    get name() {
        return this._name;
    }
    static get name2() {
        return "BYE";
    }
    static get computedname() {
        return "";
    }
    get computedname1() {
        return "";
    }
    get computedname2() {
        return "";
    }
    set computedname3(x) {}
    set computedname4(y) {}
    set foo(a) {}
    static set bar(b) {}
    static set computedname(b) {}
}
