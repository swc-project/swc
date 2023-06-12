//// [noPropertyAccessFromIndexSignature1.ts]
var // optional access property
_d, _d1, // optional access index signature
_d2, _d3;
// access property
a.foo;
a["foo"];
// access index signature
b.foo;
b["foo"];
// access property
c.foo;
c["foo"];
// access index signature
c.bar;
c["bar"];
(_d = d) === null || _d === void 0 ? void 0 : _d.foo;
(_d1 = d) === null || _d1 === void 0 ? void 0 : _d1["foo"];
(_d2 = d) === null || _d2 === void 0 ? void 0 : _d2.bar;
(_d3 = d) === null || _d3 === void 0 ? void 0 : _d3["bar"];
