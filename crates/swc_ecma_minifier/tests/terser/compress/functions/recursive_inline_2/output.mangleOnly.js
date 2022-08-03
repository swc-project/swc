function n(o) {
    return o ? o * n(o - 1) : 1;
}
console.log(n(5));
