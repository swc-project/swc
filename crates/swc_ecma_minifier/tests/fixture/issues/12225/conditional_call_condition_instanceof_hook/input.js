function run() {
    let y = 0;
    class C {
        static [Symbol.hasInstance]() {
            y = 1;
            return true;
        }
    }

    function f(a, b) {
        return a;
    }

    return ({}) instanceof C ? f(y, 1) : f(y, 2);
}

console.log(run());
