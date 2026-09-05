function f(a, b) {
    return b;
}
let x = true;
x ? f(new (class {
    accessor value = (x = false);
})(), 1) : f(new (class {
    accessor value = (x = false);
})(), 2);
