// Derived type indexer must be subtype of base type indexer
class A {
}
class B extends A {
}
var Generics;
(function(Generics) {
    class A {
    }
    class B extends A {
    }
    class B3 extends A {
    }
})(Generics || (Generics = {}));
