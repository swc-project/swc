function* foo() {
    yield 1;
    yield 2;
}
let bar = foo();
const _ref = [
    ,
    bar.next().value
], tmp = _ref[0], x = tmp === void 0 ? bar.next().value : tmp, y = _ref[1];
console.log(x, y);
