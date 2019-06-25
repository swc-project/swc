// object literal properties are widened to any

var x1 = {
    foo: null,
    bar: undefined
}

var y1 = {
    foo: null,
    bar: {
        baz: null,
        boo: undefined
    }
}

// these are not widened

var u: undefined = undefined;
var n: null = null;

var x2 = {
    foo: n,
    bar: u
}

var y2 = {
    foo: n,
    bar: {
        baz: n,
        boo: u
    }
}