//// [nullishCoalescingOperatorInAsyncGenerator.ts]
async function* f(a) {
    let c = a.b ?? 10;
    for(; c;)yield c--;
}
