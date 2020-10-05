var a = "a";
const defaultA = a;
var o = {
};
var _a = o.a, a1 = _a === void 0 ? defaultA : _a;
console.log(a1);
