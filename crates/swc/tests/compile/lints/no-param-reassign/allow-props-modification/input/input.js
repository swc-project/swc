function f(a) {
    a = 1;
}

function f(a) {
    function f3() {
        a = 1;
    }
}

function f(a) {
    a.prop = 1;
    (a).prop = 1;
    (((((((a))))))).prop = 1;
    (void 0, a).prop = 1;
    (a.prop = 1);
    (void 0, a.prop = 1, void 0)
    a.prop.b = 1;
}

function f(a) {
    a++;
    ++a;
    a.prop++;
    ++a.prop;
}

function f(a) {
    for (a of []) {}
    for (const a of []) {}

    for (a in []) {}
    for (const a in []) {}
}

function f(a) {
    delete a.x;
}

function f(a, b, c) {
    ({ a } = {});
    ({ a, b } = {});
    ({ a, b, k: { c } } = {});
    ([a] = []);
    ([{a}, [b]] = [])
}

function f(a, { b, k: { c }, k2: [ d ] }, [e, [f], { g }]) {
    a = 1;
    b = 1;
    c = 1;
    d = 1;
    e = 1;
    f = 1;
    g = 1;
}

function f(a) {
    alert(a);
}
