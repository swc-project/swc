//@target: ES6
var x, y;
var array = [
    {
        x: "",
        y: true
    }
];
var E1;
(function(E) {
    E[E["x"] = 0] = "x";
})(E1 || (E1 = {
}));
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var ref, ref1;
        ref = _step.value, x = ref.x, ref1 = ref.y, y = ref1 === void 0 ? E1.x : ref1, ref;
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
