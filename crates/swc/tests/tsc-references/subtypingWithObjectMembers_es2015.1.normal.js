class Base {
}
class Derived extends Base {
}
class Derived2 extends Derived {
}
// N and M have the same name, same accessibility, same optionality, and N is a subtype of M
// foo properties are valid, bar properties cause errors in the derived class declarations
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
var TwoLevels;
(function(TwoLevels) {
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
})(TwoLevels || (TwoLevels = {}));
