const k1 = (() => {
    const x = 'asdf';
    let y = "PASS 1";
    switch (x) {
        case x:
        default:
        case y = "FAIL":
    }
    console.log(y);
})();

const k2 = (() => {
    const x = 'asdf';
    let y = "PASS 2";
    switch (x) {
        case x:
        case y = "FAIL":
        default:
    }
    console.log(y);
})();

const k3 = (() => {
    const x = 'asdf';
    let y = "FAIL";
    switch (x) {
        case (y = "PASS 3", x):
        default:
    }
    console.log(y);
})();

const k4 = (() => {
    const x = 'asdf';
    let y = "FAIL";
    switch (x) {
        case y = "PASS 4":
        case x:
        default:
    }
    console.log(y);
})();

const k5 = (() => {
    const x = 'asdf';
    let y = "FAIL";
    let z = "FAIL";
    switch (x) {
        case y = "PASS 5":
        case z = "PASS 5":
        case x:
        default:
    }
    console.log(y, z);
})();


var c = "FAIL";
(function () {
    function f(a, NaN) {
        function g() {
            switch (a) {
                case a:
                    break;
                case ((c = "PASS"), NaN):
                    c = "FAIL"
                    break;
            }
        }
        g();
    }
    f(0 / 0);
})();
console.log(c);
