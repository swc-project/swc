let Foo;
(function(Foo) {
    Foo.a = 1;
    for(var a; Foo.a < 5; Foo.a++){}
})(Foo || (Foo = {}));
let Bar;
(function(Bar) {
    Bar.b = 2;
    var b = 3;
})(Bar || (Bar = {}));
