function f(x) {
    return [
        `${x}$\{`,
        `${x}$\{`,
        `${x}\0\x31`,
        `${x}\0\x31`,
        `${x}\\0\x31`,
        `${x}\x001`,
        `\x001${x}`,
        `\${${x}`,
        `${x}\uD800\uDC00`
    ];
}
console.log(JSON.stringify(f("a")));
