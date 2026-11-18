(function(Foo) {
    ({ a: Foo.a = 1 } = {});
    ({ b: Foo.b = 2 } = {});
    [Foo.c = 3, { d: Foo.d = 4 } = {}] = [];
    console.log("inner", Foo.a, Foo.b, Foo.c, Foo.d);
})(Foo || (Foo = {}));
console.log("outer", Foo.a, Foo.b, Foo.c, Foo.d);
var Foo;
