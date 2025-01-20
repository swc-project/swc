class Foo {
  bar(): number {
    return ((this: any): number);
  }
}
