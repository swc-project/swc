var a = 1;
var b = {
    bar: function() {
        return a + a;
    }
};
console.log(b.bar());
