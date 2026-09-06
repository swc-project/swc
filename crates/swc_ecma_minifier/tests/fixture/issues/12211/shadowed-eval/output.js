function f(value, ...rest) {
    const eval = (value)=>value;
    return eval("value");
}
console.log(f());
