var NonGeneric;
(function(NonGeneric) {
    class C {
        constructor(x){
        }
    }
    var c = new C(); // error
    var c2 = new C(''); // ok
    class C2 {
        constructor(x1){
        }
    }
    var c3 = new C2(); // error
    var c4 = new C2(''); // ok
    var c5 = new C2(1); // ok
    class D extends C2 {
    }
    var d = new D(); // error
    var d2 = new D(1); // ok
    var d3 = new D(''); // ok
})(NonGeneric || (NonGeneric = {
}));
var Generics;
(function(Generics) {
    class C {
        constructor(x){
        }
    }
    var c = new C(); // error
    var c2 = new C(''); // ok
    class C2 {
        constructor(x2){
        }
    }
    var c3 = new C2(); // error
    var c4 = new C2(''); // ok
    var c5 = new C2(1, 2); // ok
    class D extends C2 {
    }
    var d = new D(); // error
    var d2 = new D(1); // ok
    var d3 = new D(''); // ok
})(Generics || (Generics = {
}));
