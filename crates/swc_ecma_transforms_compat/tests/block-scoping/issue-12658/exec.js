// A closure that writes to a captured loop variable must update the outer one.
let r = "";
for (let i = 0; i < 3; i++) {
    (() => i++)();
    r += i;
}
console.log(r);

// Assignment inside a function expression, with `continue`.
r = "";
for (let i = 0; i < 6; i++) {
    (function () {
        i += 1;
    })();
    if (i % 2 === 0) continue;
    r += i;
}
console.log(r);

// Destructuring assignment inside a nested function.
r = "";
for (let i = 0; i < 5; i++) {
    (() => {
        [i] = [i + 2];
    })();
    r += i;
}
console.log(r);

// A shadowing binding is a different variable and is not written back.
r = "";
for (let i = 0; i < 3; i++) {
    (() => {
        let i = 10;
        i++;
    })();
    ((i) => {
        i++;
    })(i);
    r += i;
}
console.log(r);

// `for-of` and `for-in` loop variables.
r = "";
for (let x of [1, 2, 3]) {
    (() => {
        x *= 2;
    })();
    r += x;
}
console.log(r);

r = "";
for (let k in { a: 1, b: 2 }) {
    (() => {
        k += "!";
    })();
    r += k;
}
console.log(r);
