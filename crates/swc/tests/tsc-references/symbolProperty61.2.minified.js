//// [symbolProperty61.ts]
let observable = Symbol.obs;
export class MyObservable {
    subscribe(next) {
        next(this._val);
    }
    [observable]() {
        return this;
    }
    constructor(_val){
        this._val = _val;
    }
}
new MyObservable(42)[Symbol.obs]();
