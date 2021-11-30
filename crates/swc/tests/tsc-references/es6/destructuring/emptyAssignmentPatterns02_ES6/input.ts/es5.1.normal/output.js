function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
// @target: es6
// @declaration: true
var a;
var x, y, z, a1, a2, a3;
var ref, ref1;
ref1 = (ref = a, x = ref.x, y = ref.y, z = ref.z, ref), ref1;
var ref2, ref3;
ref3 = _slicedToArray((ref2 = _slicedToArray(a, 3), a1 = ref2[0], a2 = ref2[1], a3 = ref2[2], ref2), 0), ref3;
