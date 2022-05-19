// derived class constructors must contain a super call
class Base {
}
class Derived extends Base {
    constructor(){}
}
class Base2 {
}
class Derived2 extends Base2 {
    constructor(){
        var r2 = ()=>super(); // error for misplaced super call (nested function)
    }
}
class Derived3 extends Base2 {
    constructor(){
        var r = function() {
            super();
        } // error
        ;
    }
}
class Derived4 extends Base2 {
    constructor(){
        var r = super(); // ok
    }
}
