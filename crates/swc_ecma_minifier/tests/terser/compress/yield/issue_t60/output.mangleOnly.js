function* b() {
    const a = yield 1;
    yield 2;
    return a;
}
var a = b();
console.log(a.next().value, a.next().value);
