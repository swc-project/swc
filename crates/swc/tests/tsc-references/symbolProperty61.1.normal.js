//// [symbolProperty61.ts]
const observable = Symbol.obs;
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
function from(obs) {
    return obs[Symbol.obs]();
}
from(new MyObservable(42));
