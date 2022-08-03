function n() {}
function l(l) {
    return l || n;
}
console.log(l(false) === l(null));
