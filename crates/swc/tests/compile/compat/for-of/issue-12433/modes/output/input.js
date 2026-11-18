function labels(arr) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        first: second: third: for(var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            const item = _step.value;
            if (item === 1) continue first;
            if (item === 2) continue second;
            if (item === 3) continue third;
            if (item === 4) break first;
            if (item === 5) break second;
            if (item === 6) break third;
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
    first: second: third: for(let _i = 0, _iter = [
        1,
        2,
        3
    ]; _i < _iter.length; _i++){
        const item = _iter[_i];
        if (item === 1) continue first;
        if (item === 2) continue second;
        break third;
    }
}
