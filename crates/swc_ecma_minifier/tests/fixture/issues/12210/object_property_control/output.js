function f(a) {
    ++a.value;
    delete a.other;
    return a.value;
}
console.log(f({
    value: 1,
    other: 0
}));
