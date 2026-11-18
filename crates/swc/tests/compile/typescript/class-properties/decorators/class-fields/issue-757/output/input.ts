// test.ts
var Foo = /*#__PURE__*/ function(Foo) {
    Foo[Foo["A"] = 0] = "A";
    Foo[Foo["B"] = 1] = "B";
    return Foo;
}(Foo || {});
export default Foo;
