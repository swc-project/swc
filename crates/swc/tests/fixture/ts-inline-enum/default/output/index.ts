var Foo;
(function(Foo) {
    Foo[Foo["hello"] = 42] = "hello";
})(Foo || (Foo = {}));
var Foo2;
(function(Foo2) {
    Foo2["hello"] = "42";
})(Foo2 || (Foo2 = {}));
console.log(Foo.hello, Foo2.hello);
console.log("hello", "\u3053\u3093\u306B\u3061\u306F", '\uC548\uB155\uD558\uC138\uC694', "\u4F60\u597D");
var Hello;
(function(Hello) {
    Hello["en"] = "hello";
    Hello['ja-JP'] = "\u3053\u3093\u306B\u3061\u306F";
    Hello["ko-KR"] = '\uC548\uB155\uD558\uC138\uC694';
    Hello["zh-CN"] = "\u4F60\u597D";
})(Hello || (Hello = {}));
