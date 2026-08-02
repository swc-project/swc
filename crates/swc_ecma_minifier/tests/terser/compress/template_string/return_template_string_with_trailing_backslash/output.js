function a() {
    return "foo";
}
function b() {
    return `\nbar`;
}
function c() {
    return;
}
function d() {
    return;
}
function e() {
    return `\nfin`;
}
console.log(a(), b(), c(), d(), e());
