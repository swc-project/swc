// Derived member is private, base member is not causes errors
class Base {
}
class Derived extends Base {
}
var ExplicitPublic;
(function(ExplicitPublic) {
    class A {
    }
    class B extends A {
    }
    class A2 {
    }
    class B2 extends A2 {
    }
    class A3 {
    }
    class B3 extends A3 {
    }
})(ExplicitPublic || (ExplicitPublic = {
}));
var ImplicitPublic;
(function(ImplicitPublic) {
    class A {
    }
    class B extends A {
    }
    class A2 {
    }
    class B2 extends A2 {
    }
    class A3 {
    }
    class B3 extends A3 {
    }
})(ImplicitPublic || (ImplicitPublic = {
}));
