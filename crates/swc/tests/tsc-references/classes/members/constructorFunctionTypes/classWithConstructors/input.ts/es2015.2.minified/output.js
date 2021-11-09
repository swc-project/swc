var NonGeneric, Generics;
!function(NonGeneric) {
    class C {
        constructor(x){
        }
    }
    new C(), new C("");
    class C2 {
        constructor(x1){
        }
    }
    new C2(), new C2(""), new C2(1);
    class D extends C2 {
    }
    new D(), new D(1), new D("");
}(NonGeneric || (NonGeneric = {
})), (function(Generics) {
    class C {
        constructor(x){
        }
    }
    new C(), new C("");
    class C2 {
        constructor(x2){
        }
    }
    new C2(), new C2(""), new C2(1, 2);
    class D extends C2 {
    }
    new D(), new D(1), new D("");
})(Generics || (Generics = {
}));
