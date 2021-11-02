a = b, a = c, b = a = d, b = c, b = d, c = a, c = b, c = d, d = a, d = b, d = c;
export var arr, func = null;
export function useState() {
    return null;
}
export function readSegment(param) {
    var arr, i, _param = (i = 2, function(arr) {
        if (Array.isArray(arr)) return arr;
    }(arr = param) || function(arr, i) {
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
    }(arr, i) || function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }());
    _param[0], _param[1];
}
export var val = null;
r = q = r, y = x = y;
export var argumentsOfGAsFirstArgument = f(getArgsForInjection(g));
export var argumentsOfG = f.apply(void 0, function(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
        return arr2;
    }
}(arr = getArgsForInjection(g)) || function(iter) {
    if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
}(arr) || function() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}()); // captured arguments list re-spread
