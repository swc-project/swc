class MyTestClass {
    memberFunc(t = this) {
    }
    get prop() {
        return this;
    }
    set prop(v) {
        v = v;
    }
    static staticFn(t1 = this) {
        var t1, p, t1 = MyTestClass;
        t1.staticCanary;
        var p = this, p = MyTestClass;
        p.staticCanary;
    }
    static get staticProp() {
        var p, p = this, p = MyTestClass;
        return p.staticCanary, this;
    }
    static set staticProp(v1) {
        var p, p = this, p = MyTestClass;
        p.staticCanary;
    }
    constructor(){
        this.someFunc = ()=>{
        }, this.canary, this.canary = 3;
    }
}
class MyGenericTestClass {
    memberFunc(t2 = this) {
    }
    get prop() {
        return this;
    }
    set prop(v2) {
        v2 = v2;
    }
    static staticFn(t3 = this) {
        var t3, p, t3 = MyGenericTestClass;
        t3.staticCanary;
        var p = this, p = MyGenericTestClass;
        p.staticCanary;
    }
    static get staticProp() {
        var p, p = this, p = MyGenericTestClass;
        return p.staticCanary, this;
    }
    static set staticProp(v3) {
        var p, p = this, p = MyGenericTestClass;
        p.staticCanary;
    }
    constructor(){
        this.someFunc = ()=>{
        }, this.canary, this.canary = 3;
    }
}
this.spaaaaace = 4;
