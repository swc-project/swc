class Store extends BaseStore {
    constructor(){
        super();
        this.doSomething();
    }
    doSomething = ()=>{
        console.log("run");
    };
}
__decorate([
    action
], Store.prototype, "doSomething", void 0);
