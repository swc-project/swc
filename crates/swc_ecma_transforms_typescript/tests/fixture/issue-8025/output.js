(function(Foo) {
    ({ a: Foo.a } = {});
    ({ b: Foo.b } = {});
    [Foo.c, { d: Foo.d }] = [];
    console.log("inner", a, b, c, d);
})(Foo || (Foo = {}));
console.log("outer", Foo.a, Foo.b, Foo.c, Foo.d);
