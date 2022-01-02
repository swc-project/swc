// the constructor function itself does not need to be a subtype of the base type constructor function
class Base {
    constructor(x){}
}
class Derived extends Base {
    constructor(x){
        super(x);
    }
}
class Derived2 extends Base {
    // ok, not enforcing assignability relation on this
    constructor(x){
        super(x);
        return 1;
    }
}
