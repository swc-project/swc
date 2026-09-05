function run() {
    let x = true;
    let disposable = {
        [Symbol.dispose] () {
            x = false;
        }
    };
    function f(a, b) {
        return b;
    }
    return x ? f(class {
        static{
            using resource = disposable;
        }
    }, 1) : f(class {
        static{
            using resource = disposable;
        }
    }, 2);
}
