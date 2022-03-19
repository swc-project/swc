var Foo;
(function(Foo) {
    Foo[Foo["hello"] = 42] = "hello";
})(Foo || (Foo = {}));
var Foo2;
(function(Foo2) {
    Foo2["hello"] = "42";
})(Foo2 || (Foo2 = {}));
console.log(Foo.hello, Foo2.hello);
console.log("hello", "こんにちは", '안녕하세요', "\u4F60\u597D");
var Hello;
(function(Hello) {
    Hello["en"] = "hello";
    Hello['ja-JP'] = "こんにちは";
    Hello["ko-KR"] = '안녕하세요';
    Hello["zh-CN"] = "\u4F60\u597D";
})(Hello || (Hello = {}));
