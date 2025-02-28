function* n() {
    const e = yield 1;
    yield 2;
    return e;
}
var e = n();
console.log(e.next().value, e.next().value);
