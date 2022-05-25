let id = 0;

const obj = {
    get x() {
        console.log("x", id++);
    },
};

let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4, ...obj };
console.log(x);
console.log(y);
console.log(z);
