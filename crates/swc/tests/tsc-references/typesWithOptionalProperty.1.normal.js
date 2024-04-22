//// [typesWithOptionalProperty.ts]
// basic uses of optional properties without errors
var a;
var b = {
    foo: ''
};
var c = {
    foo: '',
    bar: 3
};
var d = {
    foo: '',
    bar: 3,
    baz: function() {
        return '';
    }
};
var i;
i = b;
i = c;
i = d;
a = b;
a = c;
a = d;
i = a;
a = i;
