class Store {
    constructor() {
        this.doSomething();
    }

    @action
    doSomething = () => {
        console.log("run");
    };
}
