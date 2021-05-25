function f(a) {
    return (a = {
        p: function () {
            return a;
        },
    });
}
console.log(typeof f().p());
