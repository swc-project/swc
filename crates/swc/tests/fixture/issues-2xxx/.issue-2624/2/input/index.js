async function f() {
    for (const i of [1, 2, 3]) {
        setTimeout(() => console.log(i), 100);
    }
}
