// @target: es5
//super.publicInstanceMemberFunction in constructor of derived class
//super.publicInstanceMemberFunction in instance member function of derived class
//super.publicInstanceMemberFunction in instance member accessor(get and set) of derived class
//super.publicInstanceMemberFunction in lambda in member function
//super.publicStaticMemberFunction in static member function of derived class
//super.publicStaticMemberFunction in static member accessor(get and set) of derived class
class SomeBaseClass {
    func() {
        return '';
    }
    static func() {
        return 3;
    }
    returnThis() {
        return this;
    }
}
class SomeDerivedClass extends SomeBaseClass {
    fn() {
        var x = super.func();
        var x;
        var y = ()=>super.func();
    }
    get a() {
        var x = super.func();
        var x;
        return null;
    }
    set a(n) {
        var x = super.func();
        var x;
    }
    static fn() {
        var x = super.func();
        var x;
    }
    static get a() {
        var x = super.func();
        var x;
        return null;
    }
    static set a(n) {
        var x = super.func();
        var x;
    }
    returnThis() {
        return super.returnThis();
    }
    constructor(){
        super();
        var x = super.func();
        var x;
    }
}
let instance = new SomeDerivedClass();
instance.returnThis().fn();
