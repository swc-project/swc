// @target: ES5
var x;
var y;
class Base {
    b(a2) {
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
    constructor(a){
    }
}
// Errors
// decrease visibility of all public members to protected
class Derived1 extends Base {
    constructor(a){
        super(a);
    }
}
class Derived2 extends Base {
    b(a3) {
    }
    constructor(a){
        super(a);
    }
}
class Derived3 extends Base {
    get c() {
        return x;
    }
    constructor(a){
        super(a);
    }
}
class Derived4 extends Base {
    set c(v2) {
    }
    constructor(a){
        super(a);
    }
}
class Derived5 extends Base {
    constructor(a){
        super(a);
    }
}
class Derived6 extends Base {
    constructor(a){
        super(a);
    }
}
class Derived7 extends Base {
    static s(a4) {
    }
    constructor(a){
        super(a);
    }
}
class Derived8 extends Base {
    static get t() {
        return x;
    }
    constructor(a){
        super(a);
    }
}
class Derived9 extends Base {
    static set t(v3) {
    }
    constructor(a){
        super(a);
    }
}
class Derived10 extends Base {
    constructor(a){
        super(a);
    }
}
