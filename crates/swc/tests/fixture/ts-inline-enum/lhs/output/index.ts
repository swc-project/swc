var Foo;
(function(Foo) {
    Foo[Foo["hello"] = 42] = "hello";
})(Foo || (Foo = {}));
var x;
var ref;
ref = void 0, x = ref === void 0 ? 42 : ref;
console.log(x);
