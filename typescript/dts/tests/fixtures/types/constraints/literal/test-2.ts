function bar<T extends "foo" | "bar">(f: (x: T) => T) {
    return f;
}

let h = bar(x => x);
let hResult = h("foo");
hResult = h("bar");