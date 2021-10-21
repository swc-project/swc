// the constructor function itself does not need to be a subtype of the base type constructor function
class Base {
    constructor(x){
    }
}
class Derived extends Base {
    constructor(x1){
        super(x1);
    }
}
class Derived2 extends Base {
    // ok, not enforcing assignability relation on this
    constructor(x2){
        super(x2);
        return 1;
    }
}
