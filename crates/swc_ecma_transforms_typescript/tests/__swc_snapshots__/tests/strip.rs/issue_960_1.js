function DefineAction() {
    return (target, property)=>{
        console.log(target, property);
    };
}
class Base {
    constructor(){
        this.action = new Subject();
    }
}
class Child extends Base {
    callApi() {
        console.log(this.action) // undefined
        ;
    }
}
_ts_decorate([
    DefineAction()
], Child.prototype, "action", void 0);
