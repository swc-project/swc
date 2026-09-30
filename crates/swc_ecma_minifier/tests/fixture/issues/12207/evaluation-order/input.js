function value(label) {
    console.log(label);
    return label;
}
console.log(`${value("first")}${"\${evil}"}${value("second")}` + "\`");
