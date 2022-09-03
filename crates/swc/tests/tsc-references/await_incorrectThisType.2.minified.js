//// [await_incorrectThisType.ts]
const mkLeft = (e)=>({
        tag: 'Left',
        e
    }), mkRight = (a)=>({
        tag: 'Right',
        a
    });
class EPromise {
    static succeed(a) {
        return new EPromise(Promise.resolve(mkRight(a)));
    }
    static fail(e) {
        return new EPromise(Promise.resolve(mkLeft(e)));
    }
    constructor(p){
        this.p = p;
    }
    then(onfulfilled, onrejected) {
        return this.p.then((either)=>onfulfilled?.(either.a) ?? either.a, onrejected);
    }
}
const withTypedFailure = EPromise.fail(1);
async function test() {
    await withTypedFailure;
}
withTypedFailure.then((s)=>s.toUpperCase()).then(console.log);
