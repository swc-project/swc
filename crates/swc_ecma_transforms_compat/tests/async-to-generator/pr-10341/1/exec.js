new class extends class { }{
    constructor() {
        (async () => {
            const a = {
                get foo() {
                    return this.x = 1, "before";
                }
            }
            console.log(a.foo);
            await 1;
            console.log("after")
        })();
        super()
    }
}