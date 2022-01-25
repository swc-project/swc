var myFunction = function() {
    var _loop = function(j) {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = [][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var _ = _step.value;
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
        if (j === 1) {
            console.log("before set timeout, j is:", j);
            setTimeout(function() {
                console.log("in timeout: j is", j);
            }, 50);
        }
    };
    for(var j = 0; j <= 3; j++)_loop(j);
    return null;
};
myFunction();
