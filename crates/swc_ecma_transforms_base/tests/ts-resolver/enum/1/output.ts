enum Foo__2 {
    hello__0 = 42
}
enum Foo2__2 {
    hello__0 = "42"
}
console.log(Foo__2.hello, Foo2__2.hello);
console.log(Hello__2.en, Hello__2["ja-JP"], Hello__2[`ko-KR`], Hello__2["zh-CN"]);
const enum Hello__2 {
    en__0 = "hello",
    "ja-JP" = "こんにちは",
    "ko-KR" = "안녕하세요",
    "zh-CN" = `你好`
}
