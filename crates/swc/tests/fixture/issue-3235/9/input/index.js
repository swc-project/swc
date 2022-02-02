function foo() {
    {
        let { a, b: c, d = e, f: g = h, ...i } = {};
        // all should be renamed
        use(a, c, d, g, i);
    }

    var { a, b: c, d = e, f: g = h, ...i } = {};
    use(a, c, d, g, i);
}

function bar() {
    var { a, b: c, d = e, f: g = h, ...i } = {};
    use(a, c, d, g, i);

    {
        let { a, b: c, d = e, f: g = h, ...i } = {};
        // all should be renamed
        use(a, c, d, g, i);
    }
}

{
    let b = 1; // keep name
    let e = 1; // should rename. conflict with unresoved
    let f = 1; // keep name
    let h = 1; // should rename. conflict with unresoved
}

{
    let { a, b: c, d = e, f: g = h, ...i } = {};
    // all should be renamed
    use(a, c, d, g, i);
}

// should not touch following
var a = 1;
var c = 1;
var d = 1;
var g = 1;
var i = 1;
var _ref = 1;
var tmp = 1;
