class Base {
    constructor(x){
        this.a = 1, this.a = x;
    }
}
class Derived extends Base {
    constructor(y, z){
        super(2), this.b = "", this.b = y;
    }
}
new Derived(), new class extends Derived {
    constructor(...args){
        super(...args), this.x = 1, this.y = "hello";
    }
}(1), new Derived("", "");
class D extends Base {
    constructor(y1, z1){
        super(2), this.b = null, this.b = y1;
    }
}
class D2 extends D {
    constructor(...args){
        super(...args), this.x = 2, this.y = null;
    }
}
new D2(), new D2(new Date()), new D2(new Date(), new Date());
