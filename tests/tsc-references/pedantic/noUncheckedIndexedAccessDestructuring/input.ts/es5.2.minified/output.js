function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || (function(iter) {
        if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
    })(arr) || _nonIterableRest();
}
(i = 1, _arrayWithHoles(arr = strArray) || (function(arr, i) {
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
})(arr, i) || _nonIterableRest())[0].toString(), _toArray(strArray).slice(0).push(void 0), _toArray(strArray).slice(2).push(void 0), strMap.t1.toString(), _extends({
}, strMap).z.toString();
var arr, i, ref, x = numMapPoint.x, y = numMapPoint.y, z = numMapPoint.z;
x.toFixed(), y.toFixed(), z.toFixed();
var x1 = numMapPoint.x, q = function(source, excluded) {
    if (null == source) return {
    };
    var key, i, target = function(source, excluded) {
        if (null == source) return {
        };
        var key, i, target = {
        }, sourceKeys = Object.keys(source);
        for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
        return target;
    }(source, excluded);
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
    }
    return target;
}(numMapPoint, [
    "x"
]);
x1.toFixed(), q.y.toFixed(), q.z.toFixed(), target_string = strArray[0], target_string_undef = strArray[0], target_string_arr = strArray.slice(3), (ref = numMapPoint).x, ref.y, ref.z;
