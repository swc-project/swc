let res = [];

let a = 2;
res.push(a === 2);

{
    let b = 1;
}
res.push(typeof b === "undefined");

if (true) {
    let b = 0;
}
res.push(typeof b === "undefined");

for (let b = 0; b < 10; b++) {}
res.push(typeof b === "undefined");

function test() {
    let b = 7;
}
res.push(typeof b === "undefined");
