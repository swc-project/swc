async function f(x) {
    for await (a of x) {
    }
    for await (var b of x) {
    }
    for await (let c of x) {
    }
    for await (const d of x) {
    }
}
