var n;
function o(o) {
    console.log(n === o);
    n = o;
}
function c() {}
[
    1,
    2,
    3
].forEach(function() {
    o(c);
});
