var a = "a";
const a1 = a;
const a2 = a1;
const defaultA = a2;
var o = {
};
var _a = o.a, a3 = _a === void 0 ? defaultA : _a;
console.log(a3);
