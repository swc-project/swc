class Store extends BaseStore {
    constructor(){
        super();
        this.doSomething = ()=>{
            console.log("run");
        };
        this.doSomething();
    }
    doSomething;
}
__decorate([
    action
], Store.prototype, "doSomething", void 0);
