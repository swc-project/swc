function g(x, v) {
    if ("a" === x) {
        let h;
        h = i({
            onCancel: ()=>h()
        });
    } else {
        class A {
        }
        console.log(A, A);
    }
}
g("a"), g("b");
