//// [useObjectValuesAndEntries1.ts]
var E, o = {
    a: 1,
    b: 2
}, _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _iterator = Object.values(o)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)_step.value;
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
Object.entries(o), Object.values(o), Object.entries(1), Object.values(1), Object.entries({
    a: !0,
    b: 2
}), Object.values({
    a: !0,
    b: 2
}), Object.entries({}), Object.values({});
var a = [
    "a",
    "b",
    "c"
];
Object.entries(a), Object.values(a);
var E1 = ((E = E1 || {})[E.A = 0] = "A", E[E.B = 1] = "B", E);
Object.entries(E1), Object.values(E1);
var i = {};
Object.entries(i), Object.values(i);
