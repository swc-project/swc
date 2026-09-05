function run() {
    let x = true;
    function f(a, b) {
        return b;
    }
    return x ? f(new class {
        constructor(a = x = false){}
    }(), 1) : f(new class {
        constructor(a = x = false){}
    }(), 2);
}
console.log(run());
