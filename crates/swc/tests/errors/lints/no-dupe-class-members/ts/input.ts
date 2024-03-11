() => {
    class A {
        foo() {}
        foo() {}
        foo() {}
      }
}

() => {
    class Foo {
        foo(a: string): string;
        foo(a: string): string;
        foo(a: number): number;
        foo(a: any): any {}
    }
}
