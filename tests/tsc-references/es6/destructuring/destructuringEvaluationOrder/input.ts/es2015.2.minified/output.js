function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
var _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
};
let trace = [], order = (n)=>trace.push(n)
, [{ [order(1)]: x  } = order(0)] = [], [{ [order(1)]: y  } = order(0)] = [
    {
    }
], _ref = {
}, key2 = order(0), key1 = order(2), { [key2]: { [key1]: z  } = order(1)  } = _ref;
!function(source, excluded) {
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
}(_ref, [
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
}));
let _ref1 = [
    {
        x: 1
    }
], [{}, b = a] = _ref1, a = _extends({
}, _ref1[0]);
