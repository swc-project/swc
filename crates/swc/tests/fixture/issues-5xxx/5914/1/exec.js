class Test {
    constructor(config) {
        const that = this;
        this.config = config;
        this.options = {
            config() {
                return that.config;
            },
        };
    }
}

const instance = new Test(42);
console.log(instance.options.config); 