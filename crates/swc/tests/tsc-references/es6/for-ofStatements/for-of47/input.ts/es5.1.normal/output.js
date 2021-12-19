//@target: ES6
var x, y;
var array = [
    {
        x: "",
        y: true
    }
];
var E;
(function(E) {
    E[E["x"] = 0] = "x";
})(E || (E = {
}));
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    var ref;
    for(var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var ref1;
        ref1 = _step.value, x = ref1.x, ref = E.x, y = ref, ref1;
        x;
        y;
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
