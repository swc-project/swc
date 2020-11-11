var a = "a";
const a1 = a;
const defaultA = a1;
var o = {
};
var _a = o.a, a2 = _a === void 0 ? defaultA : _a;
console.log(a2);
