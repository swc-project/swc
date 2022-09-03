//// [typeOfThisGeneral.ts]
class MyTestClass {
    constructor(){
        var p = this.canary;
        this.canary = 3;
    }
    memberFunc(t = this) {}
    get prop() {
        return this;
    }
    set prop(v) {}
    someFunc = ()=>{
        var t = this;
    };
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
        var p = this.canary;
        this.canary = 3;
    }
    memberFunc(t = this) {}
    get prop() {
        return this;
    }
    set prop(v) {}
    someFunc = ()=>{
        var t = this;
    };
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
function fn(s = this) {
    s.spaaaaaaace = 4, this.spaaaaace = 4;
}
var t, q1 = function(s = this) {
    s.spaaaaaaace = 4, this.spaaaaace = 4;
}, q2 = (s = this)=>{
    s.spaaaaaaace = 4;
    var t = this;
    this.spaaaaace = 4;
}, t = this;
this.spaaaaace = 4;
