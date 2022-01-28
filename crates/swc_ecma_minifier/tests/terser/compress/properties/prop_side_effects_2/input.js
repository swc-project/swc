var C = 1;
console.log(C);
var obj = {
    "": function () {
        return C + C;
    },
};
console.log(obj[""]());
