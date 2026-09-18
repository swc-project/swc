var count = 0;
for (let x = 0; x < 2; x++) {
    for (let i = 0, read = () => i;;) break;
    eval("x = 2");
    count++;
}
console.log(count);

function synchronousCaptures() {
    var saved = [];
    for (let x = 0; x < 2; x++) {
        for (let i = x, read = () => i, outer = eval("() => x");;) {
            saved.push(outer);
            break;
        }
    }
    return saved.map(f => f());
}
console.log(synchronousCaptures());

function bodyCaptures() {
    var saved = [];
    for (let x = 0; x < 2; x++) {
        for (let i = 0, read = () => i;;) break;
        saved.push(eval("() => x"));
    }
    return saved.map(f => f());
}
console.log(bodyCaptures());

function nestedBodyCaptures() {
    var saved = [];
    for (let x = 0; x < 2; x++) {
        for (var n = 0; n < 1; n++) {
            for (let i = 0, read = () => i;;) break;
            saved.push(eval("() => x"));
        }
    }
    return saved.map(f => f());
}
console.log(nestedBodyCaptures());

function* run() {
    var count = 0;
    var reads = [];
    for (let x = 0; x < 2; x++) {
        for (let i = yield x, read = eval("() => i");;) {
            reads.push(read);
            break;
        }
        eval("x = 2");
        count++;
    }
    return [count, reads.map(f => f())];
}
var iterator = run();
console.log(JSON.stringify(iterator.next()));
console.log(JSON.stringify(iterator.next(7)));

function* repeated() {
    var reads = [];
    for (var n = 0; n < 2; n++) {
        for (let i = yield n, read = eval("() => i");;) {
            reads.push(read);
            break;
        }
    }
    return reads.map(f => f());
}
var again = repeated();
console.log(JSON.stringify(again.next()));
console.log(JSON.stringify(again.next(7)));
console.log(JSON.stringify(again.next(8)));

function* outerCaptures() {
    var reads = [];
    for (let x = 0; x < 2; x++) {
        for (let i = yield x, read = () => i, outer = eval("() => x");;) {
            reads.push(outer);
            break;
        }
    }
    return reads.map(f => f());
}
var outer = outerCaptures();
console.log(JSON.stringify(outer.next()));
console.log(JSON.stringify(outer.next(7)));
console.log(JSON.stringify(outer.next(8)));

function* nestedYield() {
    var saved = [];
    for (let x = 0; x < 2; x++) {
        for (var n = 0; n < 1; n++) {
            for (let i = yield x, read = () => i;;) {
                saved.push(read);
                break;
            }
        }
    }
    return saved.map(f => f());
}
var nested = nestedYield();
console.log(JSON.stringify(nested.next()));
console.log(JSON.stringify(nested.next(7)));
console.log(JSON.stringify(nested.next(8)));
