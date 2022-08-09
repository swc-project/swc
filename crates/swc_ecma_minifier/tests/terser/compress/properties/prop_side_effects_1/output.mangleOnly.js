var r = 1;
console.log(r);
var a = {
    bar: function() {
        return r + r;
    }
};
console.log(a.bar());
