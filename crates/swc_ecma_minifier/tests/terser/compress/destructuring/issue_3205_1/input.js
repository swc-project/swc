function f(a) {
    function g() {
        var { b: b, c: c } = a;
        console.log(b, c);
    }
    g();
}
f({ b: 2, c: 3 });
