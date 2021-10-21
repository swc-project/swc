// @declaration: true
class C1 {
    constructor(x3){
        this.x = x3;
    }
}
class D1 {
    constructor(x1){
        this.x = x1;
    }
}
class E1 {
    constructor(x2){
        this.x = x2;
    }
}
var c = new C1(1);
var d = new D1(1); // error
var e = new E1(1); // error
var Generic;
(function(Generic) {
    class C {
        constructor(x){
            this.x = x;
        }
    }
    class D {
        constructor(x4){
            this.x = x4;
        }
    }
    class E {
        constructor(x5){
            this.x = x5;
        }
    }
    var c = new C(1);
    var d = new D(1); // error
    var e = new E(1); // error
})(Generic || (Generic = {
}));
