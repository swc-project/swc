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
let o = {
    a: 1,
    b: "no"
}, o2 = _objectSpread({
}, publicX, privateOptionalX);
o2.x, _objectSpread({
}, optionalString, optionalNumber), _objectSpread({
}, {
    b: !0
}, {
    s: "foo"
}), _objectSpread({
    b: "bad"
}, o, {
    b: "bad"
}, o2, {
    b: "bad"
}), _objectSpread({
}, o, o), _objectSpread({
    b: "ignored"
}, o);
let o3 = {
    a: 1,
    b: "no"
}, o4 = {
    b: "yes",
    c: !0
};
_objectSpread({
    b: "ok"
}, o3, o4), _objectSpread({
}, o3, {
    b: "ok"
}, o4), _objectSpread({
}, _objectSpread({
    a: 4
}, {
    b: !1,
    c: "overriden"
}), {
    d: "actually new"
}, {
    a: 5,
    d: "maybe new"
}), _objectSpread({
    a: "wrong type?"
}, o3), _objectSpread({
}, o3, {
    ["in the middle"]: 13,
    b: "maybe?"
}, o4), _objectSpread({
}, 12), _objectSpread({
}, 2), _objectSpread({
}, 0).toFixed(), _objectSpread({
}, !0).valueOf();
let spreadStr = _objectSpread({
}, "foo");
spreadStr.length, spreadStr.charAt(1), _objectSpread({
}, function() {
})(), _objectSpread({
}, {
    set b (bad){
    }
}).b = 12, _objectSpread({
}, new class {
    m() {
    }
    constructor(){
        this.p = 1;
    }
}()).m(), _objectSpread({
}, {
    a: 123
}).a;
