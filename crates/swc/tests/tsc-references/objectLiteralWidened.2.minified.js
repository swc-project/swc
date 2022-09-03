//// [objectLiteralWidened.ts]
var x1 = {
    foo: null,
    bar: void 0
}, y1 = {
    foo: null,
    bar: {
        baz: null,
        boo: void 0
    }
}, u = void 0, n = null, x2 = {
    foo: n,
    bar: u
}, y2 = {
    foo: n,
    bar: {
        baz: n,
        boo: u
    }
};
