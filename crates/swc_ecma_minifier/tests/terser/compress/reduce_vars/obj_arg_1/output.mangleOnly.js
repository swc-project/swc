var r = 1;
function n(r) {
    return r.bar();
}
console.log(n({
    bar: function() {
        return r + r;
    }
}));
