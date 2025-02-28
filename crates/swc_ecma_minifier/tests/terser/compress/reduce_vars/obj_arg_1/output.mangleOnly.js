var r = 1;
function n(n) {
    return n.bar();
}
console.log(n({
    bar: function() {
        return r + r;
    }
}));
