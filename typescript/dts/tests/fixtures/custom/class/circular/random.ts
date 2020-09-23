class A {
    b = 3;

    foo() {
        const bar = random() ? this.foo() : this.baz();
        return bar
    }

    c = this.b;

    bar() {
        return this.foo()
    }
    baz() {
        return 2
    }
}

declare function random(): boolean;