//// [assignmentTypeNarrowing.ts]
x = "", x = !0, x = (ref = 1, 1), x = !0, x = (ref1 = {
    y: 1
}).y, x = void 0 === (ref3 = (ref2 = {
    x: !0
}).x) ? "" : ref3, x = void 0 === (ref5 = (ref4 = {
    y: 1
}).y) ? /a/ : ref5;
var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var x, ref, ref1, ref2, ref3, ref4, ref5, a, _step, _iterator = a[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)x = _step.value;
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
var arr = [
    {
        x: "ok"
    }
];
arr.push({
    x: "ok"
});
