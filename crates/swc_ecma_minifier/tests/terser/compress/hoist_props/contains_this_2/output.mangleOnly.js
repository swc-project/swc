var a = {
    u: function() {
        return this === this;
    },
    p: 1
};
console.log(a.p, a.p, a.u);
