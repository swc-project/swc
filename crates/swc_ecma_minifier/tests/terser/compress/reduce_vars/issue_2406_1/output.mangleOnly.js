const n = {
    fn: function () {
        return this;
    },
};
let t = {
    fn: function () {
        return this;
    },
};
var f = {
    fn: function () {
        return this;
    },
};
console.log(n.fn(), t.fn(), f.fn());
