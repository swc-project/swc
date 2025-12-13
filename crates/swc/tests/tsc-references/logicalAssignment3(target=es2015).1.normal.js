//// [logicalAssignment3.ts]
var _a;
(_a = a).baz && (_a.baz = result.baz);
var _b;
(_b = b).baz || (_b.baz = result.baz);
var _c;
var _baz;
(_baz = (_c = c).baz) !== null && _baz !== void 0 ? _baz : _c.baz = result.baz;
