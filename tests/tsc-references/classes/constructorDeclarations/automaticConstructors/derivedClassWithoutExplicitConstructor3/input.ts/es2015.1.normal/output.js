// automatic constructors with a class hieararchy of depth > 2
class Base {
    constructor(x){
        this.a = 1;
        this.a = x;
    }
}
class Derived extends Base {
    constructor(y, z){
        super(2);
        this.b = '';
        this.b = y;
    }
}
class Derived2 extends Derived {
    constructor(...args){
        super(...args);
        this.x = 1;
        this.y = 'hello';
    }
}
var r = new Derived(); // error
var r2 = new Derived2(1); // error
var r3 = new Derived('', '');
class Base2 {
    constructor(x1){
        this.a = x1;
    }
}
class D extends Base {
    constructor(y1, z1){
        super(2);
        this.b = null;
        this.b = y1;
    }
}
class D2 extends D {
    constructor(...args1){
        super(...args1);
        this.x = 2;
        this.y = null;
    }
}
var d = new D2(); // error
var d2 = new D2(new Date()); // error
var d3 = new D2(new Date(), new Date()); // ok
