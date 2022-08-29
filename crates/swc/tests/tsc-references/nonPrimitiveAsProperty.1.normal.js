//// [nonPrimitiveAsProperty.ts]
var a = {
    foo: {
        bar: "bar"
    }
};
var b = {
    foo: "bar"
}; // expect error
