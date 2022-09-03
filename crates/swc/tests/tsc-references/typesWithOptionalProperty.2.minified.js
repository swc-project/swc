//// [typesWithOptionalProperty.ts]
var a, i, b = {
    foo: ""
}, c = {
    foo: "",
    bar: 3
}, d = {
    foo: "",
    bar: 3,
    baz: function() {
        return "";
    }
};
i = b, i = c, i = d, a = b, a = c, a = i = a = d;
