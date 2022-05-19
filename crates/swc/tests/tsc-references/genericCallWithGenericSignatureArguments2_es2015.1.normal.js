// When a function expression is inferentially typed (section 4.9.3) and a type assigned to a parameter in that expression references type parameters for which inferences are being made, 
// the corresponding inferred type arguments to become fixed and no further candidate inferences are made for them.
var onlyT;
(function(onlyT) {
    function foo(a, b) {
        var r;
        return r;
    }
    var r1 = foo((x)=>1, (x)=>'');
    function other2(x) {
        var r7 = foo((a)=>a, (b)=>b); // T => T
        // BUG 835518
        var r9 = r7(new Date()); // should be ok
        var r10 = r7(1); // error
    }
    function foo2(a, b) {
        var r;
        return r;
    }
    function other3(x) {
        var r7 = foo2((a)=>a, (b)=>b); // error
        var r7b = foo2((a)=>a, (b)=>b); // valid, T is inferred to be Date
    }
    let E;
    (function(E) {
        E[E["A"] = 0] = "A";
    })(E || (E = {}));
    let F;
    (function(F) {
        F[F["A"] = 0] = "A";
    })(F || (F = {}));
    function foo3(x, a, b) {
        var r;
        return r;
    }
    var r71 = foo3(E.A, (x)=>E.A, (x)=>F.A); // error
})(onlyT || (onlyT = {}));
var TU;
(function(TU) {
    function foo(a, b) {
        var r;
        return r;
    }
    var r1 = foo((x)=>1, (x)=>'');
    function other2(x) {
        var r7 = foo((a)=>a, (b)=>b);
        var r9 = r7(new Date());
        var r10 = r7(1);
    }
    function foo2(a, b) {
        var r;
        return r;
    }
    function other3(x) {
        var r7 = foo2((a)=>a, (b)=>b);
        var r7b = foo2((a)=>a, (b)=>b);
    }
    let E;
    (function(E) {
        E[E["A"] = 0] = "A";
    })(E || (E = {}));
    let F;
    (function(F) {
        F[F["A"] = 0] = "A";
    })(F || (F = {}));
    function foo3(x, a, b) {
        var r;
        return r;
    }
    var r72 = foo3(E.A, (x)=>E.A, (x)=>F.A);
})(TU || (TU = {}));
