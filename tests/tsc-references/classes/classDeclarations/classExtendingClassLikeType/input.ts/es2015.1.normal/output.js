// Error, no Base constructor function
class D0 extends Base {
}
class D1 extends getBase() {
    constructor(){
        super("abc", "def");
        this.x = "x";
        this.y = "y";
    }
}
class D2 extends getBase() {
    constructor(){
        super(10);
        super(10, 20);
        this.x = 1;
        this.y = 2;
    }
}
class D3 extends getBase() {
    constructor(){
        super("abc", 42);
        this.x = "x";
        this.y = 2;
    }
}
// Error, no constructors with three type arguments
class D4 extends getBase() {
}
// Error, constructor return types differ
class D5 extends getBadBase() {
}
