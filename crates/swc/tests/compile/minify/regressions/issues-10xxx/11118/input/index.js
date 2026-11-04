function xxx() {
    const b = [...arguments];
    const c = [2, ...arguments];
    return b.length + c.length;
}
