var o = 1;
console.log(o);
var n = {
    "": function () {
        return o + o;
    },
};
console.log(n[""]());
