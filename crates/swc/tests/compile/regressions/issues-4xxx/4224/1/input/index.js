class A {
    constructor() {
        this.foo = async () => {
            this.x();
        };
        this.bar = async () => {
            this.x();
        };
    }
}

console.log(A);
