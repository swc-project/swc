alert(a);

console.log(a);

function f1() {
    alert(a);
}

obj[a];

`${a}`;

[a];

var x = a + "";

var e = {
    [a]: "",
};

const a = {};

// ----
function f2() {
    alert(b);
    const b = {};
}

// ----
console.log(a1);

const { a1, a2 } = {};

console.log(a2);

// ----
console.log(a3);

const { a3 = "a" } = {};

// ----
console.log(a4);

const {
    n: { a4 },
} = {};

// ----
console.log(a5);

const { ...a5 } = {};

// ----
console.log(a6);

const [a6] = {};

// ----
console.log(a7);

const [_, ...a7] = {};

function b1(a) {
    alert(a);
}
