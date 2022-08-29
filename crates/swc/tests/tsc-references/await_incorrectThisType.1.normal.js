//// [await_incorrectThisType.ts]
// https://github.com/microsoft/TypeScript/issues/47711
const mkLeft = (e)=>({
        tag: 'Left',
        e
    });
const mkRight = (a)=>({
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
        return this.p.then(// Casting to `Right<A>` is safe here because we've eliminated the possibility of `Left<E>`.
        (either)=>onfulfilled?.(either.a) ?? either.a, onrejected);
    }
}
const withTypedFailure = EPromise.fail(1);
// Errors as expected:
//
// "The 'this' context of type 'EPromise<number, string>' is not assignable to method's
//     'this' of type 'EPromise<never, string>"
withTypedFailure.then((s)=>s.toUpperCase()).then(console.log);
async function test() {
    await withTypedFailure;
}
