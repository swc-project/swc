enum Foo__1 {
    hello__0 = 42
}
enum Foo2__1 {
    hello__0 = "42"
}
console.log(Foo__1.hello, Foo2__1.hello);
console.log(Hello__1.en, Hello__1["ja-JP"], Hello__1[`ko-KR`], Hello__1['zh-CN']);
const enum Hello__1 {
    en__0 = "hello",
    'ja-JP' = "こんにちは",
    "ko-KR" = '안녕하세요',
    "zh-CN" = `你好`
}
