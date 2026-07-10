function createFoo() {
    return function Foo() {
        "use memo";
        return <div>hello, world</div>;
    };
}
