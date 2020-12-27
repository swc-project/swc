var defaultA = "a";
var o = {
};
const defaultA1 = defaultA;
const defaultA2 = defaultA1;
const defaultA3 = defaultA2;
var _a = o.a, a = _a === void 0 ? defaultA3 : _a;
console.log(a);
