var a = 2;
(function f(b) {
    return (b && f()) || a--;
})(1);
console.log(a);
