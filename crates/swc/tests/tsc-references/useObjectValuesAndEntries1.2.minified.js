//// [useObjectValuesAndEntries1.ts]
var E, o = {
    a: 1,
    b: 2
}, _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _iterator = Object.values(o)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)var x, y = _step.value;
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
var entries = Object.entries(o), values = Object.values(o), entries1 = Object.entries(1), values1 = Object.values(1), entries2 = Object.entries({
    a: !0,
    b: 2
}), values2 = Object.values({
    a: !0,
    b: 2
}), entries3 = Object.entries({}), values3 = Object.values({}), a = [
    "a",
    "b",
    "c"
], entries4 = Object.entries(a), values4 = Object.values(a);
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B";
}(E || (E = {}));
var entries5 = Object.entries(E), values5 = Object.values(E), i = {}, entries6 = Object.entries(i), values6 = Object.values(i);
