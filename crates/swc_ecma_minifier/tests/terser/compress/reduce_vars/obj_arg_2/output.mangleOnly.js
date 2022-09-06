var n = 1;
function r(n) {
    return n.bar();
}
console.log(
    r({
        bar: function () {
            return n + n;
        },
    })
);
