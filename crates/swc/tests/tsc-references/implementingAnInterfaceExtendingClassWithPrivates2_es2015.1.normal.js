class Foo {
}
class Bar extends Foo {
}
class Bar2 extends Foo {
}
class Bar3 extends Foo {
}
// another level of indirection
var M;
(function(M) {
    class Foo1 {
    }
    class Baz extends Foo1 {
    }
    class Bar extends Foo1 {
    }
    class Bar2 extends Foo1 {
    }
    class Bar3 extends Foo1 {
    }
})(M || (M = {}));
// two levels of privates
var M2;
(function(M2) {
    class Foo2 {
    }
    class Baz extends Foo2 {
    }
    class Bar extends Foo2 {
    }
    var b;
    var r1 = b.z;
    var r2 = b.x; // error
    var r3 = b.y; // error
    class Bar2 extends Foo2 {
    }
    class Bar3 extends Foo2 {
    }
})(M2 || (M2 = {}));
