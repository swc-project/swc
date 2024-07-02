var a;
function g() {}
[
    1,
    2,
    3
].forEach(function() {
    (function(b) {
        console.log(a === b);
        a = b;
    })(g);
});
