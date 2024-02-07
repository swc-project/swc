//// [controlFlowNoIntermediateErrors.ts]
// Repros from #46475
function f1() {
    var code = 0;
    var otherCodes = [
        2,
        0,
        1,
        0,
        2,
        2,
        2,
        0,
        1,
        0,
        2,
        1,
        1,
        0,
        2,
        1
    ];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = otherCodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var code2 = _step.value;
            if (code2 === 0) {
                code = code === 2 ? 1 : 0;
            } else {
                code = 2;
            }
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
}
function f2() {
    var code = 0;
    while(true){
        code = code === 1 ? 0 : 1;
    }
}
