// @strict: true
function f(p, r, pr, rp) {
    let a1 = p;
    let a2 = r;
    let a3 = pr;
    let a4 = rp;
    let b1 = p; // Error
    let b2 = r;
    let b3 = pr; // Error
    let b4 = rp; // Error
    let c1 = p;
    let c2 = r;
    let c3 = pr;
    let c4 = rp;
    let d1 = p;
    let d2 = r;
    let d3 = pr;
    let d4 = rp;
}
function doit() {
    let previous = Object.create(null);
    let current = Object.create(null);
    let args1 = {
        previous,
        current
    };
    let args2 = {
        previous,
        current
    };
}
function doit2() {
    let previous = Object.create(null);
    let current = Object.create(null);
    let args1 = {
        previous,
        current
    };
    let args2 = {
        previous,
        current
    };
}
