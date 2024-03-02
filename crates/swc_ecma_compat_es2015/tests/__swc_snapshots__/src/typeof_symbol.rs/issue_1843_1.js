function isUndef(type) {
    return type === 'undefined';
}
var isWeb = !isUndef(typeof window === "undefined" ? "undefined" : _type_of(window)) && 'onload' in window;
exports.isWeb = isWeb;
var isNode = !isUndef(typeof process === "undefined" ? "undefined" : _type_of(process)) && !!(process.versions && process.versions.node);
exports.isNode = isNode;
var isWeex = !isUndef(typeof WXEnvironment === "undefined" ? "undefined" : _type_of(WXEnvironment)) && WXEnvironment.platform !== 'Web';
exports.isWeex = isWeex;
