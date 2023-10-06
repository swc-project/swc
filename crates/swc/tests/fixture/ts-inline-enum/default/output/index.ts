var Foo;
(function(Foo) {
    Foo[Foo["hello"] = 42] = "hello";
})(Foo || (Foo = {}));
var Foo2;
(function(Foo2) {
    Foo2["hello"] = "42";
})(Foo2 || (Foo2 = {}));
console.log(42, "42");
console.log("hello", "こんにちは", "안녕하세요", "你好");
var Hello;
