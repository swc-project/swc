interface Foo {
  (): string;
}

let a = {} as Foo;
let c: string = a();
