var Bar, ns;
export var Foo;
!function(Foo) {
    Foo[Foo.A = 0] = "A", Foo[Foo.B = 1] = "B";
}(Foo || (Foo = {})), function(Bar) {
    Bar[Bar.A = 0] = "A", Bar[Bar.B = 1] = "B";
}(Bar || (Bar = {})), Foo.A, Bar.A, function(ns1) {
    var Foo, Foo;
    (Foo = Foo = ns1.Foo || (ns1.Foo = {}))[Foo.X = 0] = "X", ns.Foo.X;
}(ns || (ns = {})), function(Foo) {
    Foo[Foo.X = 0] = "X";
}(Foo || (Foo = {})), Foo.X;
