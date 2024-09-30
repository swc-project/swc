(function(Foo) {
    Foo.a = 1;
    for(var a; Foo.a < 5; Foo.a++){}
})(Foo || (Foo = {}));
(function(Bar) {
    Bar.b = 2;
    var b = 3;
})(Bar || (Bar = {}));
var Foo, Bar;
