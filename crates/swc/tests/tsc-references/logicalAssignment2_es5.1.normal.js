// @strict: true
// @target: esnext, es2021, es2020, es2015
var _a, _b, _c, _foo, _ref, _foo1, _ref1, _foo2, _ref2, _ref3, _ref4, _ref5;
(_a = a).baz && (_a.baz = result.baz);
(_b = b).baz || (_b.baz = result.baz);
var _baz;
(_baz = (_c = c).baz) !== null && _baz !== void 0 ? _baz : _c.baz = result.baz;
(_foo = a.foo)[_ref = "baz"] && (_foo[_ref] = result.foo.baz);
(_foo1 = b.foo)[_ref1 = "baz"] || (_foo1[_ref1] = result.foo.baz);
var ref;
(ref = (_foo2 = c.foo)[_ref2 = "baz"]) !== null && ref !== void 0 ? ref : _foo2[_ref2] = result.foo.baz;
(_ref3 = a.foo.bar()).baz && (_ref3.baz = result.foo.bar().baz);
(_ref4 = b.foo.bar()).baz || (_ref4.baz = result.foo.bar().baz);
var _baz1;
(_baz1 = (_ref5 = c.foo.bar()).baz) !== null && _baz1 !== void 0 ? _baz1 : _ref5.baz = result.foo.bar().baz;
