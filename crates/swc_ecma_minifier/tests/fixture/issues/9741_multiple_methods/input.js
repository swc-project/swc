// Test multiple different methods being hoisted
const a = Object.assign({}, {});
const b = Object.assign({}, {});
const c = Object.keys({a: 1});
const d = Object.keys({b: 2});
const e = Array.isArray([]);
const f = Array.isArray({});
console.log(a, b, c, d, e, f);
