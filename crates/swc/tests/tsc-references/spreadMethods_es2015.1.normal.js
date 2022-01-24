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
// @target: esnext
class K {
    m() {}
    get g() {
        return 0;
    }
    constructor(){
        this.p = 12;
    }
}
let k = new K();
let sk = _objectSpread({}, k);
let ssk = _objectSpread({}, k, k);
sk.p;
sk.m(); // error
sk.g; // error
ssk.p;
ssk.m(); // error
ssk.g; // error
let i = {
    p: 12,
    m () {},
    get g () {
        return 0;
    }
};
let si = _objectSpread({}, i);
let ssi = _objectSpread({}, i, i);
si.p;
si.m(); // ok
si.g; // ok
ssi.p;
ssi.m(); // ok
ssi.g; // ok
let o = {
    p: 12,
    m () {},
    get g () {
        return 0;
    }
};
let so = _objectSpread({}, o);
let sso = _objectSpread({}, o, o);
so.p;
so.m(); // ok
so.g; // ok
sso.p;
sso.m(); // ok
sso.g; // ok
