// Check that errors are reported for non-generic types with type arguments
class C {
}
var E;
(function(E) {})(E || (E = {}));
var v1;
var v2;
var v3;
var v4;
function f() {
    class C {
    }
    ;
    let E;
    (function(E) {})(E || (E = {}));
    var v1;
    var v2;
    var v3;
    var v4;
    var v5;
}
