class Foo extends Bar {
    constructor() {
        for (const i of [1]) {
            setTimeout(() => {
                console.log(this, i)
            });
        }
        super();
    }
}