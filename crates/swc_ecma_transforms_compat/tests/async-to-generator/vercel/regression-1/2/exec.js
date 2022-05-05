function Foo() {
    this.isFoo = true;

    const forThis = async () => {
        return this.isFoo;
    };

    const forArguments = async () => {
        return arguments[0];
    };

    return {
        forThis,
        forArguments,
    };
}

const foo = new Foo(0);

console.log(foo.forThis());
console.log(foo.forArguments());
