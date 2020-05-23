function test(cb: () => string) {
    let s = cb();
    return s;
}
