var C = 1;
var bar = function () {
    return C + C;
};
function f(obj) {
    return obj.bar();
}
console.log(f({ bar }));
