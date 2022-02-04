(function() {
    class Foo {
    }
    return console.log(Foo.prop), Foo.prop++, console.log(Foo.prop), Foo.prop++, console.log(Foo.prop), Foo.prop++, Foo;
})().prop = 1;
