function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
var arr, i, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, trace = [], order = function(n) {
    return trace.push(n);
}, tmp = void 0;
(void 0 === tmp ? order(0) : tmp)[order(1)];
var tmp1 = {
};
(void 0 === tmp1 ? order(0) : tmp1)[order(1)];
var _ref = {
}, key2 = order(0), key1 = order(2), tmp2 = _ref[key2];
(void 0 === tmp2 ? order(1) : tmp2)[key1], (function(source, excluded) {
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
})(_ref, [
    key2
].map(function(arg) {
    var key = function(input, hint) {
        if ("object" !== _typeof(input) || null === input) return input;
        var prim = input[Symbol.toPrimitive];
        if (void 0 !== prim) {
            var res = prim.call(input, hint || "default");
            if ("object" !== _typeof(res)) return res;
            throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === hint ? String : Number)(input);
    }(arg, "string");
    return "symbol" === _typeof(key) ? key : String(key);
})), void 0 === tmp3;
var _ref1 = [
    {
        x: 1
    }
], __ref = (i = 2, function(arr) {
    if (Array.isArray(arr)) return arr;
}(arr = _ref1) || function(arr, i) {
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
}()), ref = __ref[0], ref = null !== ref ? ref : function(e) {
    throw e;
}(new TypeError("Cannot destructure undefined")), tmp3 = __ref[1];
_extends({
}, _ref1[0]);
