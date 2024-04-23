//// [a.js]
({
    f: function(s) {
        return this.n + s.length;
    },
    n: 1
}).f('hi');
