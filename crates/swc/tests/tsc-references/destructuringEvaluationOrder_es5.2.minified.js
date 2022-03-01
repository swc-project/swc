function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key2 in source)Object.prototype.hasOwnProperty.call(source, key2) && (target[key2] = source[key2]);
        }
        return target;
    }).apply(this, arguments);
}
var _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, trace = [], order = function(n) {
    return trace.push(n);
}, tmp = void 0;
(void 0 === tmp ? order(0) : tmp)[order(1)];
var tmp1 = {};
(void 0 === tmp1 ? order(0) : tmp1)[order(1)];
var _ref = {}, key = order(0), key1 = order(2), tmp2 = _ref[key];
(void 0 === tmp2 ? order(1) : tmp2)[key1], (function(source, excluded) {
    if (null == source) return {};
    var key2, i, target = function(source, excluded) {
        if (null == source) return {};
        var key2, i, target = {}, sourceKeys = Object.keys(source);
        for(i = 0; i < sourceKeys.length; i++)key2 = sourceKeys[i], excluded.indexOf(key2) >= 0 || (target[key2] = source[key2]);
        return target;
    }(source, excluded);
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++)key2 = sourceSymbolKeys[i], excluded.indexOf(key2) >= 0 || Object.prototype.propertyIsEnumerable.call(source, key2) && (target[key2] = source[key2]);
    }
})(_ref, [
    key
].map(function(arg) {
    var key2 = function(input, hint) {
        if ("object" !== _typeof(input) || null === input) return input;
        var prim = input[Symbol.toPrimitive];
        if (void 0 !== prim) {
            var res = prim.call(input, hint || "default");
            if ("object" !== _typeof(res)) return res;
            throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === hint ? String : Number)(input);
    }(arg, "string");
    return "symbol" === _typeof(key2) ? key2 : String(key2);
}));
var _ref1 = [
    {
        x: 1
    }
], __ref = function(arr, i) {
    return (function(arr) {
        if (Array.isArray(arr)) return arr;
    })(arr) || (function(arr, i) {
        var _s, _e, _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
        if (null != _i) {
            var _arr = [], _n = !0, _d = !1;
            try {
                for(_i = _i.call(arr); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
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
        }
    })(arr, i) || (function(o, minLen) {
        if (o) {
            if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
        }
    })(arr, i) || (function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
}(_ref1, 2), ref = __ref[0], ref = null !== ref ? ref : function(e) {
    throw e;
}(new TypeError("Cannot destructure undefined"));
__ref[1], _extends({}, _ref1[0]);
