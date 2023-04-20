class Store {
    constructor(){
        this.doSomething();
    }
    doSomething = ()=>{
        console.log("run");
    };
}
_ts_decorate([
    action
], Store.prototype, "doSomething", void 0);
