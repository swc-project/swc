var C = 1;
function f(obj) {
    return obj.bar();
}
console.log(
    f({
        bar: function () {
            return C + C;
        },
    })
);
