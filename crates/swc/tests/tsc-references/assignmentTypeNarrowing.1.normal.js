//// [assignmentTypeNarrowing.ts]
var x;
x = "";
x; // string
x = true;
x; // boolean
var ref;
ref = 1, x = ref === void 0 ? "" : ref;
x; // string | number
x = ({
    x: true
}).x;
x; // boolean
var ref1;
ref1 = {
    y: 1
}, x = ref1.y, ref1;
x; // number
var ref2, ref3;
ref2 = {
    x: true
}, ref3 = ref2.x, x = ref3 === void 0 ? "" : ref3, ref2;
x; // string | boolean
var ref4, ref5;
ref4 = {
    y: 1
}, ref5 = ref4.y, x = ref5 === void 0 ? /a/ : ref5, ref4;
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
