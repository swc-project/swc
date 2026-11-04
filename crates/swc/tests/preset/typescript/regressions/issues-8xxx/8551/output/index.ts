var _computedKey;
_computedKey = Symbol.iterator;
class C {
    [_computedKey]() {}
}
(function(NS) {
    function f() {}
    NS.f = f;
})(NS || (NS = {}));
var NS;
