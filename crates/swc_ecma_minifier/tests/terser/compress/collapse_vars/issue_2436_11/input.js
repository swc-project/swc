function matrix() {}
function isCollection() {}
function _randomDataForMatrix() {}
function _randomInt() {}
function f(arg1, arg2) {
    if (isCollection(arg1)) {
        var size = arg1;
        var max = arg2;
        var min = 0;
        var res = _randomDataForMatrix(size.valueOf(), min, max, _randomInt);
        return size && true === size.isMatrix ? matrix(res) : res;
    } else {
        var min = arg1;
        var max = arg2;
        return _randomInt(min, max);
    }
}
