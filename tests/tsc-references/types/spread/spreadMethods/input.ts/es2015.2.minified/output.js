function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {
        }, ownKeys = Object.keys(source);
        "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }))), ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
let k = new class {
    m() {
    }
    get g() {
        return 0;
    }
    constructor(){
        this.p = 12;
    }
}(), sk = _objectSpread({
}, k), ssk = _objectSpread({
}, k, k);
sk.p, sk.m(), sk.g, ssk.p, ssk.m(), ssk.g;
let i1 = {
    p: 12,
    m () {
    },
    get g () {
        return 0;
    }
}, si = _objectSpread({
}, i1), ssi = _objectSpread({
}, i1, i1);
si.p, si.m(), si.g, ssi.p, ssi.m(), ssi.g;
let o = {
    p: 12,
    m () {
    },
    get g () {
        return 0;
    }
}, so = _objectSpread({
}, o), sso = _objectSpread({
}, o, o);
so.p, so.m(), so.g, sso.p, sso.m(), sso.g;
