declare class Foo {
  foo1(this: string): void;

  foo2(this: string, bar: number): void;

  foo3(this: string, bar: number, ...rest: Array<boolean>): void;

  foo4(this: string, ...rest: Array<boolean>): void;
}
