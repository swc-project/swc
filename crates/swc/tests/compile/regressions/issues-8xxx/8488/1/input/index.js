class Foo {
    bar(v = this.a?.b?.c) {}
}

new Foo().bar();
