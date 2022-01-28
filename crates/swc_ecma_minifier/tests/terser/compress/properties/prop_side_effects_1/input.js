var C = 1;
console.log(C);
var obj = {
    bar: function () {
        return C + C;
    },
};
console.log(obj.bar());
