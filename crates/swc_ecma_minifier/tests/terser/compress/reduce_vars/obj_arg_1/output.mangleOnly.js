var b = 1;
function a(a) {
    return a.bar();
}
console.log(a({
    bar: function() {
        return b + b;
    }
}));
