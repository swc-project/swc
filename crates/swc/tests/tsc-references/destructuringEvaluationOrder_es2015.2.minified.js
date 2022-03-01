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
};
let trace = [], order = (n)=>trace.push(n)
, [{ [order(1)]: x  } = order(0)] = [], [{ [order(1)]: y  } = order(0)] = [
    {}
], _ref = {}, key = order(0), key1 = order(2), { [key]: { [key1]: z  } = order(1)  } = _ref;
!function(source, excluded) {
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
    return target;
}(_ref, [
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
let _ref1 = [
    {
        x: 1
    }
], [{}, b = a] = _ref1, a = _extends({}, _ref1[0]);
