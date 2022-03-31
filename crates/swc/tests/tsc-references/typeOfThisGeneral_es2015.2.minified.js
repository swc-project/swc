class MyTestClass {
    memberFunc(t = this) {}
    get prop() {
        return this;
    }
    set prop(v) {}
    static staticFn(t = this) {
        var p, t = MyTestClass;
        t.staticCanary;
        var p = this, p = MyTestClass;
        p.staticCanary;
    }
    static get staticProp() {
        var p, p = this, p = MyTestClass;
        return p.staticCanary, this;
    }
    static set staticProp(v) {
        var p, p = this, p = MyTestClass;
        p.staticCanary;
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
        var p = this, p = MyGenericTestClass;
        p.staticCanary;
    }
    static get staticProp() {
        var p, p = this, p = MyGenericTestClass;
        return p.staticCanary, this;
    }
    static set staticProp(v) {
        var p, p = this, p = MyGenericTestClass;
        p.staticCanary;
    }
    constructor(){
        this.someFunc = ()=>{}, this.canary, this.canary = 3;
    }
}
this.spaaaaace = 4;
