var x;
x = "";
x; // string
x = true;
x; // boolean
x = "" = 1;
x; // string | number
x = ({
    x: true
}).x;
x; // boolean
var ref;
ref = {
    y: 1
}, x = ref.y, ref;
x; // number
var ref1, ref2;
ref1 = {
    x: true
}, ref2 = ref1.x, x = ref2 === void 0 ? "" : ref2, ref1;
x; // string | boolean
var ref3;
ref3 = {
    y: 1
}, x = /a/ = ref3.y, ref3;
x; // number | RegExp
var a;
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = a[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        x = _step.value;
        x; // string
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
var arr = [
    {
        x: "ok"
    }
]; // weak type
arr.push({
    x: "ok"
});
