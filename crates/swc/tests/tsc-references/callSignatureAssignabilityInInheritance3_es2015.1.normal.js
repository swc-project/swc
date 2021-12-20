// checking subtype relations for function types as it relates to contextual signature instantiation
// error cases
var Errors;
(function(Errors) {
    class Base {
    }
    class Derived extends Base {
    }
    class Derived2 extends Derived {
    }
    class OtherDerived extends Base {
    }
})(Errors || (Errors = {
}));
