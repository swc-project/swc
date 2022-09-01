var x = 2, a = 1;
(function f1(a1) {
    a++;
    --x >= 0 && f1({});
})(a++);
console.log(a);
