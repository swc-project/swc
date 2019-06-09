interface Foo {
  x: string;
}

class Bar {
  x: string;
  constructor() {
    this.x = "foo";
  }
}

let a: Foo = new Bar();
