//// [neverTypeErrors2.ts]
function f1() {
    var x;
    x = 1;
    x = "abc";
    x = false;
    x = undefined;
    x = null;
    x = {};
    x();
}
function f2() {
    return;
}
function f3() {
    return 1;
}
function f4() {}
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = f4()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var n = _step.value;
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
for(var n1 in f4()){}
