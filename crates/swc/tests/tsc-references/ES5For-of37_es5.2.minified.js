var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _iterator = [
        0,
        1,
        2,
        3,
        4
    ][Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0){
        var i = _step.value;
        try {
            var _iteratorNormalCompletion1 = !0, _didIteratorError1 = !1, _iteratorError1 = void 0;
            try {
                for(var _step1, _iterator1 = [
                    1,
                    2,
                    3
                ][Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = !0)if (_step1.value, 2 === i) throw Error("ERR");
            } catch (err) {
                _didIteratorError1 = !0, _iteratorError1 = err;
            } finally{
                try {
                    _iteratorNormalCompletion1 || null == _iterator1.return || _iterator1.return();
                } finally{
                    if (_didIteratorError1) throw _iteratorError1;
                }
            }
            console.log(i);
        } catch (err1) {
            console.log("E %s %s", i, err1);
        }
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
