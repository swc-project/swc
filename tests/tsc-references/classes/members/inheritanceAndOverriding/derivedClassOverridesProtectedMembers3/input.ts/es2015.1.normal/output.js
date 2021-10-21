// @target: ES5
var x;
var y;
class Base {
    b(a) {
    }
    get c() {
        return x;
    }
    set c(v) {
    }
    static s(a1) {
    }
    static get t() {
        return x;
    }
    static set t(v1) {
    }
    constructor(a2){
    }
}
// Errors
// decrease visibility of all public members to protected
class Derived1 extends Base {
    constructor(a3){
        super(a3);
    }
}
class Derived2 extends Base {
    b(a4) {
    }
    constructor(a5){
        super(a5);
    }
}
class Derived3 extends Base {
    get c() {
        return x;
    }
    constructor(a6){
        super(a6);
    }
}
class Derived4 extends Base {
    set c(v2) {
    }
    constructor(a7){
        super(a7);
    }
}
class Derived5 extends Base {
    constructor(a8){
        super(a8);
    }
}
class Derived6 extends Base {
    constructor(a9){
        super(a9);
    }
}
class Derived7 extends Base {
    static s(a10) {
    }
    constructor(a11){
        super(a11);
    }
}
class Derived8 extends Base {
    static get t() {
        return x;
    }
    constructor(a12){
        super(a12);
    }
}
class Derived9 extends Base {
    static set t(v3) {
    }
    constructor(a13){
        super(a13);
    }
}
class Derived10 extends Base {
    constructor(a14){
        super(a14);
    }
}
