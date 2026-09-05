function run() {
    let x = true;
    Math.random = ()=>(x = false, 0);
    function f(a, b) {
        return b;
    }
    return x ? f(Math.random(), 1) : f(Math.random(), 2);
}
console.log(run());
