const c = {
    fn: function () {
        return this;
    },
};
let l = {
    fn: function () {
        return this;
    },
};
var v = {
    fn: function () {
        return this;
    },
};
console.log(c.fn(), l.fn(), v.fn());
