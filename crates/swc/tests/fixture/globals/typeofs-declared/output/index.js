var _typeof = function(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
var window = 'foo';
console.log(typeof window === "undefined" ? "undefined" : _typeof(window));
