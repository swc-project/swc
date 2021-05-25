function f(a) {
    (function () {
        var { b: b, c: c } = a;
        console.log(b, c);
    })();
}
f({ b: 2, c: 3 });
