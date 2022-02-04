function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i1 = 1; i1 < arguments.length; i1++){
        var source = arguments[i1] != null ? arguments[i1] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
let i = _objectSpread({}, indexed1, {
    b: 11
});
// only indexed has indexer, so i[101]: any
i[101];
let ii = _objectSpread({}, indexed1, indexed2);
// both have indexer, so i[1001]: number | boolean
ii[1001];
indexed3 = _objectSpread({}, b ? indexed3 : undefined);
var writable = _objectSpread({}, roindex);
writable.a = 0; // should be ok.
