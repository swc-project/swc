const o1 = {
    x: "a",
    foo() {
        const o2 = {
            get [(() => this.x)()]() {
                return 1;
            },
        };
        console.log(o2.a === 1);
    },
};

o1.foo();