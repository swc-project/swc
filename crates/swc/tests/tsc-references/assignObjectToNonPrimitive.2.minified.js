//// [assignObjectToNonPrimitive.ts]
var a, x = {}, y = {
    foo: "bar"
};
a = x, a = y;
