function run(value) {
    let x = 0;
    function update() {
        x = value;
        return value;
    }
    function f(a, b) {
        return b;
    }
    return f(class {
        value = x;
    }, update() ? 1 : 2);
}
console.log(run(1));
