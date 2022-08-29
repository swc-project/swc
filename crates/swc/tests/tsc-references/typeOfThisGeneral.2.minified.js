//// [typeOfThisGeneral.ts]
class MyTestClass {
    constructor(){
        this.canary, this.canary = 3;
    }
    memberFunc(t = this) {}
    get prop() {
        return this;
    }
    set prop(v) {}
    someFunc = ()=>{};
    static staticFn(t = this) {
        var p, t = MyTestClass;
        t.staticCanary;
        var p = MyTestClass;
        p.staticCanary;
    }
    static get staticProp() {
        return MyTestClass.staticCanary, this;
    }
    static set staticProp(v) {
        MyTestClass.staticCanary;
    }
}
class MyGenericTestClass {
    constructor(){
        this.canary, this.canary = 3;
    }
    memberFunc(t = this) {}
    get prop() {
        return this;
    }
    set prop(v) {}
    someFunc = ()=>{};
    static staticFn(t = this) {
        var p, t = MyGenericTestClass;
        t.staticCanary;
        var p = MyGenericTestClass;
        p.staticCanary;
    }
    static get staticProp() {
        return MyGenericTestClass.staticCanary, this;
    }
    static set staticProp(v) {
        MyGenericTestClass.staticCanary;
    }
}
this.spaaaaace = 4;
