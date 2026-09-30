function value(label) {
    return console.log(label), label;
}
console.log(`${value("first")}\${evil}${value("second")}\``);
