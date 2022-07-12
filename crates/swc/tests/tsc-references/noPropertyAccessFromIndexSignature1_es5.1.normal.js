// @noPropertyAccessFromIndexSignature: true
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
// optional access property
d === null || d === void 0 ? void 0 : d.foo;
d === null || d === void 0 ? void 0 : d["foo"];
// optional access index signature
d === null || d === void 0 ? void 0 : d.bar;
d === null || d === void 0 ? void 0 : d["bar"];
