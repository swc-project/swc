var C = 1;
var bar = function () {
    return C + C;
};
var obj = { bar };
console.log(obj.bar());
