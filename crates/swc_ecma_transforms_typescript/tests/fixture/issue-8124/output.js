(function(Foo) {
    Foo.a = 1;
    for(var a; a < 5; a++){}
})(Foo || (Foo = {}));
(function(Bar) {
    Bar.b = 2;
    var b = 3;
})(Bar || (Bar = {}));
