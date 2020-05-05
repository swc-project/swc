interface Foo {
  (n: number): number;
  (): string;
}

let a = {} as Foo;
let b: number = a(1);
let c: string = a();
