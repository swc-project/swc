var a = 1;
console.log(a);
var b = {
    bar: function() {
        return a + a;
    }
};
console.log(b.bar());
