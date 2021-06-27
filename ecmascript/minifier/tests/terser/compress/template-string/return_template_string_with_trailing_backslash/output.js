function a() {
    return "foo";
}
function b() {
    return `\nbar`;
}
function c() {
    return;
    ("baz");
}
function d() {
    return;
    ("qux");
}
function e() {
    return `\nfin`;
}
console.log(a(), b(), c(), d(), e());
