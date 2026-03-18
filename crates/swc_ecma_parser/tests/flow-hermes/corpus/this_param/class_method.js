class Foo {
  foo1(this: string) {}

  foo2(this: string, bar: number) {}

  foo3(this: string, bar: number, ...rest: Array<boolean>) {}

  foo4(this: string, ...rest: Array<boolean>) {}
}
