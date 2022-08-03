function l() {}
function o() {
    return "foo";
}
console.log(l() || true || o());
console.log(o() || true || l());
console.log((l() || true) && o());
console.log((o() || true) && l());
console.log((l() && true) || o());
console.log((o() && true) || l());
console.log(l() && true && o());
console.log(o() && true && l());
console.log(l() || false || o());
console.log(o() || false || l());
console.log((l() || false) && o());
console.log((o() || false) && l());
console.log((l() && false) || o());
console.log((o() && false) || l());
console.log(l() && false && o());
console.log(o() && false && l());
