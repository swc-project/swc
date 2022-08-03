function* e() {
    const e = yield 1;
    yield 2;
    return e;
}
var n = e();
console.log(n.next().value, n.next().value);
