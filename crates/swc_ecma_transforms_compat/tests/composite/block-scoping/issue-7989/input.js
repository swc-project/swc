async function foo(a, b) {
    for (let i = 0; i < 5; i++) {
        const boo = await a();
        b(() => boo)
    }
}
