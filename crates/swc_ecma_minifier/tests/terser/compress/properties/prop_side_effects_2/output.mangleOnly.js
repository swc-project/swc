var a = 1;
console.log(a);
var b = {
    "": function() {
        return a + a;
    }
};
console.log(b[""]());
