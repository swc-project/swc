//// [callChainInference.ts]
// Repro from #42404
var _value_foo, _this;
if (value) {
    var _value_foo1, _this1;
    (_this1 = value) === null || _this1 === void 0 ? void 0 : (_value_foo1 = _this1.foo) === null || _value_foo1 === void 0 ? void 0 : _value_foo1.call(_this1, "a");
}
(_this = value) === null || _this === void 0 ? void 0 : (_value_foo = _this.foo) === null || _value_foo === void 0 ? void 0 : _value_foo.call(_this, "a");
