function l() {}
function n(n) {
    return n || l;
}
console.log(n(false) === n(null));
