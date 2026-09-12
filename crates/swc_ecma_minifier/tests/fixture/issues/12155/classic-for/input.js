let a;
console.log(a);
for (let a = globalThis.loopValue; globalThis.loopCondition; a++) {
    globalThis.loopCondition = false;
    consume(a);
}
