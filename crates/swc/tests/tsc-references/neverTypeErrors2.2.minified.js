//// [neverTypeErrors2.ts]
function f1() {
    ({})();
}
function f2() {}
function f3() {
    return 1;
}
function f4() {}
var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _iterator = f4()[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)var n = _step.value;
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
for(var n1 in f4());
function f5() {}
function func() {
    return {
        value: []
    };
}
