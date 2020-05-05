// Repro from #13787

class SampleClass<P> {
    public props: Readonly<P>;

    constructor(props: P) {
        this.props = Object.freeze(props);
    }
}

interface Foo {
    foo: string;
}

declare function merge<T, U>(obj1: T, obj2: U): T & U;

class AnotherSampleClass<T> extends SampleClass<T & Foo> {
    constructor(props: T) {
        const foo: Foo = {foo: "bar"};
        super(merge(props, foo));
    }

    public brokenMethod() {
        this.props.foo.concat;
    }
}

new AnotherSampleClass({});
