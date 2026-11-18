const enum Foo {
    hello = 42,
}

let x;
[x = Foo.hello] = [,];

console.log(x);
