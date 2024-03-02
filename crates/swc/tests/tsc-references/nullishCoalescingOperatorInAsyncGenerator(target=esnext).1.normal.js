//// [nullishCoalescingOperatorInAsyncGenerator.ts]
// https://github.com/microsoft/TypeScript/issues/37686
async function* f(a) {
    let c = a.b ?? 10;
    while(c){
        yield c--;
    }
}
