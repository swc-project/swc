function f() {
    const h = i({
        onCancel: () => h(),
    });
}

function g(x, v) {
    if (x === "a") {
        f(v);
    } else {
        class A {}
        console.log(A, A);
    }
}

g("a");
g("b");
