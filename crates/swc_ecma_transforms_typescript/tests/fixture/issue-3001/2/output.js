var X = 4;
var Foo;
(function(Foo) {
    Foo[Foo["A"] = 0] = "A";
    Foo[Foo["B"] = 0] = "B";
    Foo[Foo["C"] = 2] = "C";
    Foo[Foo["D"] = Foo.C * X] = "D";
    Foo[Foo["E"] = 6] = "E";
    Foo[Foo["F"] = Math.E * 2] = "F";
})(Foo || (Foo = {
}));
