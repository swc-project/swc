//// [callChainInference.ts]
// Repro from #42404
var _value_foo, _object;
if (value) {
    var _value_foo1, _object1;
    (_object1 = value) === null || _object1 === void 0 ? void 0 : (_value_foo1 = _object1.foo) === null || _value_foo1 === void 0 ? void 0 : _value_foo1.call(_object1, "a");
}
(_object = value) === null || _object === void 0 ? void 0 : (_value_foo = _object.foo) === null || _value_foo === void 0 ? void 0 : _value_foo.call(_object, "a");
