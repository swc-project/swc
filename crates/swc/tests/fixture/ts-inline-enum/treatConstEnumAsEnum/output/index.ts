var Foo;
(function(Foo) {
    Foo[Foo["hello"] = 42] = "hello";
})(Foo || (Foo = {}));
var Foo2;
(function(Foo2) {
    Foo2["hello"] = "42";
})(Foo2 || (Foo2 = {}));
var Bar;
(function(Bar) {
    Bar[Bar["hello"] = 42] = "hello";
})(Bar || (Bar = {}));
var Bar2;
(function(Bar2) {
    Bar2["hello"] = "42";
})(Bar2 || (Bar2 = {}));
console.log(Foo.hello, Foo2.hello);
console.log(Bar.hello, Bar2.hello);
