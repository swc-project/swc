function matrix() {}
function isCollection() {}
function _randomDataForMatrix() {}
function _randomInt() {}
function f(arg1, arg2) {
    if (isCollection(arg1)) {
        var size = arg1,
            max = arg2,
            min = 0,
            res = _randomDataForMatrix(size.valueOf(), min, max, _randomInt);
        return size && true === size.isMatrix ? matrix(res) : res;
    } else {
        return _randomInt((min = arg1), (max = arg2));
    }
}
