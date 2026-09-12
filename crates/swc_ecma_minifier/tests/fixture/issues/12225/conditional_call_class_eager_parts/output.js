function run() {
    let x = true;
    Math.random = ()=>(x = false, Object);
    function f(a, b) {
        return b;
    }
    return x ? f(class extends Math.random() {
        static [Math.random()] = Math.random();
    }, 1) : f(class extends Math.random() {
        static [Math.random()] = Math.random();
    }, 2);
}
console.log(run());
