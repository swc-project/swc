function f(value, ...rest) {
    arguments: for (;;) {
        if (value) {
            break arguments;
        }
        continue arguments;
    }
    return value;
}

console.log(f(true));
