//// [typeGuardOfFormTypeOfFunction.ts]
function f1(x) {}
function f2(x) {}
function f3(x) {}
function f4(x) {}
function f5(x) {}
function f6(x) {}
function f10(x) {}
function f11(x) {}
function f12(x) {}
function f100(obj, keys) {
    var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
    try {
        for(var _step, _iterator = keys[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0){
            var item = obj[_step.value];
            "function" == typeof item && item.call(obj);
        }
    } catch (err) {
        _didIteratorError = !0, _iteratorError = err;
    } finally{
        try {
            _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
        } finally{
            if (_didIteratorError) throw _iteratorError;
        }
    }
}
function configureStore(reducer) {}
function f101(x) {
    return "object" == typeof x && x.anything;
}
