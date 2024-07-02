// foo(), {}.__proto__
f({a: foo(), b: 5}.__proto__);

// foo(), bar(), undefined
f({a: foo(), b: bar()}.invalid);

// foo1(), bar(), baz(), foo2(), undefined
f({
    a: foo1(),
    b: {
        a: bar(),
        b: {
            a: baz()
        },
        c: foo2()
    }
}.invalid);
