function n(n) {
    return (n = {
        p: function () {
            return n;
        },
    });
}
console.log(typeof n().p());
