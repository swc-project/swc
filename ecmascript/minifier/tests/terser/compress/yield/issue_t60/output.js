function* t() {
    const v = yield 1;
    yield 2;
    return v;
}
var g = t();
console.log(g.next().value, g.next().value);
