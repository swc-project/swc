var a = 1;
function b(a) {
    return a.bar();
}
console.log(b({
    bar: function() {
        return a + a;
    }
}));
