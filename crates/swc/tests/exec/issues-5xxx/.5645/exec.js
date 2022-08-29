const t = {
    1: 'a',
    2: 'b'
}
function g(arg) {
    if (t[arg] === undefined) {
        var arg = 2
    }
    return t[arg]
}

console.log(g(1))