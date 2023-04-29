class Store extends BaseStore {
    constructor(){
        super();
        this.doSomething();
    }
    doSomething = ()=>{
        console.log("run");
    };
}
_ts_decorate([
    action
], Store.prototype, "doSomething", void 0);
