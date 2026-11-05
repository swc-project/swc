
class Foo {
    constractur() {
        const foo = async () => {
            return new.target;
        };
    }

    hello() {
        const world = async () => {
            return super.hello();
        };
    }
}
