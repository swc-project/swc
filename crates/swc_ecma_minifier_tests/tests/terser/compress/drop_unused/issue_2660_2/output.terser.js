var a = 1;
(function f(b) {
    b && f(), (--a).toString();
})(),
    console.log(a);
