// @strictNullChecks: true
// @declaration: true

interface Foo {
    a: number;
    b?: number;

    f(): number;

    g?(): number;
}

function test1(x: Foo) {
    x.a;
    x.b;
    x.f;
    x.g;
    let f1 = x.f();
    let g1 = x.g && x.g();
    let g2 = x.g ? x.g() : 0;
}
