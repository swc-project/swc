function f(x) {
    return [
        `${x}\${evil}`,
        `${x}\``,
        `\\\${evil}\\\`${x}`
    ];
}
console.log(JSON.stringify(f("a")));
