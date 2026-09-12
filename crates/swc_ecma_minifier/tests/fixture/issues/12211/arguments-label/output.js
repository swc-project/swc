function f(value) {
    arguments: for(;;)if (value) break arguments;
    return value;
}
console.log(f(true));
