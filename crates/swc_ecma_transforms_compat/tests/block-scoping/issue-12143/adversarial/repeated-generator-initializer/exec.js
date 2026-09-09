function* run() {
    var reads = [];
    for (var n = 0; n < 2; n++) {
        for (let i = yield n, read = () => i;;) {
            reads.push(read);
            break;
        }
    }
    return reads.map(f => f()).join();
}
var iterator = run();
console.log(JSON.stringify(iterator.next()));
console.log(JSON.stringify(iterator.next(7)));
console.log(JSON.stringify(iterator.next(8)));
