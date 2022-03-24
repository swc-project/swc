var _value, ref;
var myVar = {
    target: {
        value: "ABC"
    }
};
console.log((ref = (_value = myVar.target.value).toLowerCase) === null || ref === void 0 ? void 0 : ref.call(_value));
