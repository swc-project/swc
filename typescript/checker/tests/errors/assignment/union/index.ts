type Foo = "a" | "b";

function foo(a: unknown): Foo {
  switch (a) {
    case "a":
    case "b":
    case "c":
      return a;
    default:
      throw new Error("");
  }
}
