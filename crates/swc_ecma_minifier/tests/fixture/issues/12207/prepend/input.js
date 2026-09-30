function f(x) {
    return ["\${evil}" + `${x}`, "\`" + `${x}`, "\\${evil}\\`" + `${x}`];
}
console.log(JSON.stringify(f("a")));
