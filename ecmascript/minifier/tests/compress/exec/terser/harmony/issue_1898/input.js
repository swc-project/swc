class Foo {
    bar() {
        for (const x of [6, 5]) {
            for (let y of [4, 3]) {
                for (var z of [2, 1]) {
                    console.log(x, y, z);
                }
            }
        }
    }
}
new Foo().bar();
