enum Foo {
    hello = 42,
}

enum Foo2 {
    hello = "42",
}

console.log(Foo.hello, Foo2.hello);

console.log(Hello.en, Hello["ja-JP"], Hello[`ko-KR`], Hello['zh-CN']);

const enum Hello {
    en = "hello",
    'ja-JP' = "こんにちは",
    "ko-KR" = '안녕하세요',
    "zh-CN" = `你好`,
}
