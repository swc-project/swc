var _computedKey;
_computedKey = Symbol.iterator;
class C {
    [_computedKey]() {}
}
var NS;
(function(NS) {
    function f() {}
    NS.f = f;
})(NS || (NS = {}));
