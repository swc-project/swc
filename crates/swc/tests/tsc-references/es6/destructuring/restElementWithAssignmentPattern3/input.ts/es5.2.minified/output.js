var ref, arr, arr, i;
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
(ref = (arr = (_arrayWithHoles(arr = [
    "",
    1
]) || (function(iter) {
    if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
})(arr) || _nonIterableRest()).slice(0), i = 2, _arrayWithHoles(arr) || (function(arr, i) {
    var _arr = [], _n = !0, _d = !1, _e = void 0;
    try {
        for(var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
    } catch (err) {
        _d = !0, _e = err;
    } finally{
        try {
            _n || null == _i.return || _i.return();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
})(arr, i) || _nonIterableRest()))[0], void 0 === ref[1];
