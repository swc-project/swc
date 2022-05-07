class MyTestClass {
    memberFunc(t = this) {}
    get prop() {
        return this;
    }
    set prop(v) {}
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
    constructor(){
        this.someFunc = ()=>{}, this.canary, this.canary = 3;
    }
}
class MyGenericTestClass {
    memberFunc(t = this) {}
    get prop() {
        return this;
    }
    set prop(v) {}
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
    constructor(){
        this.someFunc = ()=>{}, this.canary, this.canary = 3;
    }
}
this.spaaaaace = 4;
