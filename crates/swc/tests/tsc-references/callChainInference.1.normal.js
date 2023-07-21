//// [callChainInference.ts]
// Repro from #42404
var _value;
if (value) {
    var _value1;
    (_value1 = value) === null || _value1 === void 0 ? void 0 : _value1.foo("a");
}
(_value = value) === null || _value === void 0 ? void 0 : _value.foo("a");
