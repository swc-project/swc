function* yieldingBody() {
    var saved = [];
    for (let x = 0; x < 2; x++) {
        for (let i = 0, read = () => i;;) break;
        saved.push(eval("() => x"));
        yield x;
    }
    return saved.map(f => f());
}
var iterator = yieldingBody();
console.log(JSON.stringify(iterator.next()));
console.log(JSON.stringify(iterator.next()));
console.log(JSON.stringify(iterator.next()));

function bodyLocals() {
    var saved = [];
    for (let x = 0; x < 2; x++) {
        let local = x;
        for (let i = 0, read = () => i;;) break;
        saved.push(() => local);
        eval("x = x");
    }
    return saved.map(f => f());
}
console.log(JSON.stringify(bodyLocals()));
