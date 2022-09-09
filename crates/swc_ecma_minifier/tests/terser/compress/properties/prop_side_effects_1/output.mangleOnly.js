var o = 1;
console.log(o);
var r = {
    bar: function () {
        return o + o;
    },
};
console.log(r.bar());
