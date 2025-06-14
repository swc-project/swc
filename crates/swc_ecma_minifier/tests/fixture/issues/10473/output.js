"use strict";
function _typeof(e) {
    return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e;
    } : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
    })(e);
}
function ownKeys(t, e) {
    var o, r = Object.keys(t);
    return Object.getOwnPropertySymbols && (o = Object.getOwnPropertySymbols(t), e && (o = o.filter(function(e) {
        return Object.getOwnPropertyDescriptor(t, e).enumerable;
    })), r.push.apply(r, o)), r;
}
function _objectSpread(t) {
    for(var e = 1; e < arguments.length; e++){
        var o = null != arguments[e] ? arguments[e] : {};
        e % 2 ? ownKeys(Object(o), !0).forEach(function(e) {
            !function(e, t, o) {
                var e1;
                (e1 = function(e, t) {
                    if ("object" != _typeof(e) || !e) return e;
                    var o = e[Symbol.toPrimitive];
                    if (void 0 === o) return ("string" === t ? String : Number)(e);
                    if (o = o.call(e, t || "default"), "object" != _typeof(o)) return o;
                    throw TypeError("@@toPrimitive must return a primitive value.");
                }(e1 = t, "string"), (t = "symbol" == _typeof(e1) ? e1 : e1 + "") in e) ? Object.defineProperty(e, t, {
                    value: o,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = o;
            }(t, e, o[e]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(o)) : ownKeys(Object(o)).forEach(function(e) {
            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(o, e));
        });
    }
    return t;
}
var cmConfig = (cmConfig = {
    isToutiao: "Toutiao" === Math.random(),
    appid: "xxx",
    version: "5.8.20"
}).isToutiao ? _objectSpread(_objectSpread({}, cmConfig), {
    name: "toutiao"
}) : _objectSpread(_objectSpread({}, cmConfig), {
    name: "douyin"
});
console.log(exports.config = cmConfig);
