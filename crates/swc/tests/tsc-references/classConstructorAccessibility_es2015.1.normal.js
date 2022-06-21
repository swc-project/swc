// @declaration: true
class C {
    constructor(x){
        this.x = x;
    }
}
class D {
    constructor(x){
        this.x = x;
    }
}
class E {
    constructor(x){
        this.x = x;
    }
}
var c = new C(1);
var d = new D(1); // error
var e = new E(1); // error
var Generic;
(function(Generic) {
    class C {
        constructor(x){
            this.x = x;
        }
    }
    class D {
        constructor(x){
            this.x = x;
        }
    }
    class E {
        constructor(x){
            this.x = x;
        }
    }
    var c = new C(1);
    var d = new D(1); // error
    var e = new E(1); // error
})(Generic || (Generic = {}));
