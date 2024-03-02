// test.ts
var Foo;
(function(Foo) {
    Foo[Foo["A"] = 0] = "A";
    Foo[Foo["B"] = 1] = "B";
})(Foo || (Foo = {}));
export default Foo;
