function run() {
    let x = true;

    class C {
        static [Symbol.hasInstance]() {
            x = false;
            return true;
        }
    }

    function f(a, b) {
        return b;
    }

    return x ? f({} instanceof C, 1) : f({} instanceof C, 2);
}

function safePrimitiveInstanceof() {
    let x = true;

    function f(a, b) {
        return b;
    }

    return x ? f(0 instanceof function () {}, 1) : f(0 instanceof function () {}, 2);
}

console.log(run(), safePrimitiveInstanceof());
