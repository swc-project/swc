// @target: esnext
class MyTestClass {
    //type of 'this' in member function param list is the class instance type
    memberFunc(t1 = this) {
        var t1;
        //type of 'this' in member function body is the class instance type
        var p = this;
        var p;
    }
    //type of 'this' in member accessor(get and set) body is the class instance type
    get prop() {
        var p = this;
        var p;
        return this;
    }
    set prop(v) {
        var p = this;
        var p;
        p = v;
        v = p;
    }
    //type of 'this' in static function param list is constructor function type
    static staticFn(t2 = this) {
        var t2;
        var t2 = MyTestClass;
        t2.staticCanary;
        //type of 'this' in static function body is constructor function type
        var p = this;
        var p;
        var p = MyTestClass;
        p.staticCanary;
    }
    static get staticProp() {
        //type of 'this' in static accessor body is constructor function type
        var p = this;
        var p;
        var p = MyTestClass;
        p.staticCanary;
        return this;
    }
    static set staticProp(v1) {
        //type of 'this' in static accessor body is constructor function type
        var p = this;
        var p;
        var p = MyTestClass;
        p.staticCanary;
    }
    constructor(){
        this.someFunc = ()=>{
            //type of 'this' in member variable initializer is the class instance type
            var t = this;
            var t;
        };
        //type of 'this' in constructor body is the class instance type
        var p = this.canary;
        var p;
        this.canary = 3;
    }
}
class MyGenericTestClass {
    //type of 'this' in member function param list is the class instance type
    memberFunc(t3 = this) {
        var t3;
        //type of 'this' in member function body is the class instance type
        var p = this;
        var p;
    }
    //type of 'this' in member accessor(get and set) body is the class instance type
    get prop() {
        var p = this;
        var p;
        return this;
    }
    set prop(v2) {
        var p = this;
        var p;
        p = v2;
        v2 = p;
    }
    //type of 'this' in static function param list is constructor function type
    static staticFn(t4 = this) {
        var t4;
        var t4 = MyGenericTestClass;
        t4.staticCanary;
        //type of 'this' in static function body is constructor function type
        var p = this;
        var p;
        var p = MyGenericTestClass;
        p.staticCanary;
    }
    static get staticProp() {
        //type of 'this' in static accessor body is constructor function type
        var p = this;
        var p;
        var p = MyGenericTestClass;
        p.staticCanary;
        return this;
    }
    static set staticProp(v3) {
        //type of 'this' in static accessor body is constructor function type
        var p = this;
        var p;
        var p = MyGenericTestClass;
        p.staticCanary;
    }
    constructor(){
        this.someFunc = ()=>{
            //type of 'this' in member variable initializer is the class instance type
            var t = this;
            var t;
        };
        //type of 'this' in constructor body is the class instance type
        var p = this.canary;
        var p;
        this.canary = 3;
    }
}
//type of 'this' in a function declaration param list is Any
function fn(s = this) {
    var s;
    s.spaaaaaaace = 4;
    //type of 'this' in a function declaration body is Any
    var t;
    var t = this;
    this.spaaaaace = 4;
}
//type of 'this' in a function expression param list list is Any
var q1 = function(s = this) {
    var s;
    s.spaaaaaaace = 4;
    //type of 'this' in a function expression body is Any
    var t;
    var t = this;
    this.spaaaaace = 4;
};
//type of 'this' in a fat arrow expression param list is typeof globalThis
var q2 = (s = this)=>{
    var s;
    s.spaaaaaaace = 4;
    //type of 'this' in a fat arrow expression body is typeof globalThis
    var t;
    var t = this;
    this.spaaaaace = 4;
};
//type of 'this' in global module is GlobalThis
var t;
var t = this;
this.spaaaaace = 4;
