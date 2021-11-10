class Foo {
    bar() {
        for (const f of [6, 5])
            for (let r of [4, 3]) for (var o of [2, 1]) console.log(f, r, o);
    }
}
new Foo().bar();
