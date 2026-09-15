function* run() {
    for (let i = yield "ready", read = () => [i, arguments[0], this.value]; i < 10;) {
        i = 42;
        yield read();
        break;
    }
}
var iterator = run.call({ value: 8 }, 9);
console.log(JSON.stringify(iterator.next()));
console.log(JSON.stringify(iterator.next(7)));
console.log(JSON.stringify(iterator.next()));

async function runAsync() {
    for (let i = await Promise.resolve(1), read = () => [i, this.value, arguments[0]];;) {
        i = 42;
        console.log(read().join());
        break;
    }
}
runAsync.call({ value: 8 }, 9);
