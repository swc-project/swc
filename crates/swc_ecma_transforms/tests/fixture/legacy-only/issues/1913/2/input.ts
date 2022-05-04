class Store extends BaseStore {
    constructor() {
        super();
        this.doSomething();
    }

    @action
    doSomething = () => {
        console.log("run");
    };
}
