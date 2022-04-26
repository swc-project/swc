class Foo {
    static #_ = (() => { this.bar = "3"; })();
}

console.log(Foo.bar)
console.log(new Foo().bar)