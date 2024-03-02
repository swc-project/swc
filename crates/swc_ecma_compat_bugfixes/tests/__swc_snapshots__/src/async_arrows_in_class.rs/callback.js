class Foo {
    foo() {
        bar(async function() {
            return await 1;
        });
    }
}
