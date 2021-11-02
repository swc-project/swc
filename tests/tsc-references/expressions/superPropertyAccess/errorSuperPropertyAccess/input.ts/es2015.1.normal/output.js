//super property access in constructor of class with no base type
//super property access in instance member function of class with no base type
//super property access in instance member accessor(get and set) of class with no base type
class NoBase {
    fn() {
        var a = super.prototype;
        var b = super.hasOwnProperty('');
    }
    //super static property access in static member function of class with no base type
    //super static property access in static member accessor(get and set) of class with no base type
    static static1() {
        super.hasOwnProperty('');
    }
    static get static2() {
        super.hasOwnProperty('');
        return '';
    }
    static set static2(n) {
        super.hasOwnProperty('');
    }
    constructor(){
        this.m = super.prototype;
        this.n = super.hasOwnProperty('');
        var a = super.prototype;
        var b = super.hasOwnProperty('');
    }
}
class SomeBase {
    privateFunc() {
    }
    publicFunc() {
    }
    static privateStaticFunc() {
    }
    static publicStaticFunc() {
    }
    constructor(){
        this.privateMember = 0;
        this.publicMember = 0;
    }
}
SomeBase.privateStaticMember = 0;
SomeBase.publicStaticMember = 0;
//super.publicInstanceMemberNotFunction in constructor of derived class
//super.publicInstanceMemberNotFunction in instance member function of derived class
//super.publicInstanceMemberNotFunction in instance member accessor(get and set) of derived class
//super property access only available with typed this
class SomeDerived1 extends SomeBase {
    fn() {
        var x = super.publicMember;
    }
    get a() {
        var x = super.publicMember;
        return undefined;
    }
    set a(n1) {
        n1 = super.publicMember;
    }
    fn2() {
        function inner() {
            super.publicFunc();
        }
        var x = {
            test: function() {
                return super.publicFunc();
            }
        };
    }
    constructor(){
        super();
        super.publicMember = 1;
    }
}
//super.privateProperty in constructor of derived class
//super.privateProperty in instance member function of derived class
//super.privateProperty in instance member accessor(get and set) of derived class
class SomeDerived2 extends SomeBase {
    fn() {
        var x = super.privateMember;
    }
    get a() {
        var x = super.privateMember;
        return undefined;
    }
    set a(n2) {
        n2 = super.privateMember;
    }
    constructor(){
        super();
        super.privateMember = 1;
    }
}
//super.publicStaticMemberNotFunction in static member function of derived class
//super.publicStaticMemberNotFunction in static member accessor(get and set) of derived class
//super.privateStaticProperty in static member function of derived class
//super.privateStaticProperty in static member accessor(get and set) of derived class
class SomeDerived3 extends SomeBase {
    static fn() {
        super.publicStaticMember = 3;
        super.privateStaticMember = 3;
        super.privateStaticFunc();
    }
    static get a() {
        super.publicStaticMember = 3;
        super.privateStaticMember = 3;
        super.privateStaticFunc();
        return '';
    }
    static set a(n3) {
        super.publicStaticMember = 3;
        super.privateStaticMember = 3;
        super.privateStaticFunc();
    }
}
// In object literal
var obj = {
    n: super.wat,
    p: super.foo()
};
