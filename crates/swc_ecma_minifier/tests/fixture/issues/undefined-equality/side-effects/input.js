function value() {
    console.log("value");
    return null;
}
function effect() {
    console.log("effect");
}
console.log(value() == void effect());
console.log(void effect() == value());
console.log(value() != void effect());
console.log(void effect() != value());
try {
    console.log(value() == void missing);
} catch (error) {
    console.log(error.name);
}
try {
    console.log(void missing == value());
} catch (error) {
    console.log(error.name);
}
