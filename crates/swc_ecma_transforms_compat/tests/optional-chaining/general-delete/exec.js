"use strict";

const obj = {
    a: {
        b: 0,
    },
};

console.log(delete obj?.a?.b);
console.log(delete obj?.a);
console.log(delete obj?.c?.b);

// Ensure we delete in sloppy function, so delete returns false instead of
// throwing an error.
new Function(
    `(${() => {
        const obj = {
            a: Object.defineProperty({}, "b", {
                configurable: false,
                writable: false,
                value: "b",
            }),
        };
        console.log(delete obj?.a?.b);
        console.log(delete obj?.a);
    }})()`
)();

