//// [logicalAssignment3.ts]
var _a, _b, _c;
(_a = a).baz && (_a.baz = result.baz);
(_b = b).baz || (_b.baz = result.baz);
var _baz;
(_baz = (_c = c).baz) !== null && _baz !== void 0 ? _baz : _c.baz = result.baz;
