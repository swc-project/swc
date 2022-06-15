var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    // @downlevelIteration: true
    // https://github.com/microsoft/TypeScript/issues/30083
    for(var _iterator = [
        0,
        1,
        2,
        3,
        4
    ][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var i = _step.value;
        try {
            var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
            try {
                // Ensure catch binding for the following loop is reset per iteration:
                for(var _iterator1 = [
                    1,
                    2,
                    3
                ][Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                    var j = _step1.value;
                    if (i === 2) {
                        throw new Error("ERR");
                    }
                }
            } catch (err) {
                _didIteratorError1 = true;
                _iteratorError1 = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                        _iterator1.return();
                    }
                } finally{
                    if (_didIteratorError1) {
                        throw _iteratorError1;
                    }
                }
            }
            console.log(i);
        } catch (err1) {
            console.log("E %s %s", i, err1);
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
