// merged interfaces behave as if all extends clauses from each declaration are merged together
// no errors expected
class C {
}
class C2 {
}
class D {
}
var a;
var r = a.a;
// generic interfaces in a module
var M;
(function(M) {
    class C {
    }
    class C2 {
    }
    class D {
    }
})(M || (M = {
}));
