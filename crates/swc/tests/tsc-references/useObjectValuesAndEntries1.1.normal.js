//// [useObjectValuesAndEntries1.ts]
var o = {
    a: 1,
    b: 2
};
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = Object.values(o)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var x = _step.value;
        var y = x;
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally{
    try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
        }
    } finally{
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}
var entries = Object.entries(o); // [string, number][]
var values = Object.values(o); // number[]
var entries1 = Object.entries(1); // [string, any][]
var values1 = Object.values(1); // any[]
var entries2 = Object.entries({
    a: true,
    b: 2
}); // [string, number|boolean][]
var values2 = Object.values({
    a: true,
    b: 2
}); // (number|boolean)[]
var entries3 = Object.entries({}); // [string, {}][]
var values3 = Object.values({}); // {}[]
var a = [
    "a",
    "b",
    "c"
];
var entries4 = Object.entries(a); // [string, string][]
var values4 = Object.values(a); // string[]
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    return E;
}(E || {});
var entries5 = Object.entries(E); // [string, any][]
var values5 = Object.values(E); // any[]
var i = {};
var entries6 = Object.entries(i); // [string, any][]
var values6 = Object.values(i); // any[]
