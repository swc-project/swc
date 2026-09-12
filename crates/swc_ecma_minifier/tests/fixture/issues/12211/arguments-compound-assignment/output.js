function f(value, ...rest) {
    value = "changed";
    return Array.prototype.shift.call(arguments ||= []);
}
console.log(f("original"));
