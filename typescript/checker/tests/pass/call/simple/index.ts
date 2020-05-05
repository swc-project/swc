interface Foo {
  call(n: number): number;
  call(): string;
}

let a = {} as Foo;
let b: number = a.call(1);
let c: string = a.call();
