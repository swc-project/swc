var a;
function b(b) {
    console.log(a === b);
    a = b;
}
function c() {}
[
    1,
    2,
    3
].forEach(function() {
    b(c);
});
