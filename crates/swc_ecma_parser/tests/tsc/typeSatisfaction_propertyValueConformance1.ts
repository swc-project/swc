// @noPropertyAccessFromIndexSignature: true, false

type Facts = { [key: string]: boolean };
declare function checkTruths(x: Facts): void;
declare function checkM(x: { m: boolean }): void;
const x = {
    m: true
};

// Should be OK
checkTruths(x);
// Should be OK
checkM(x);
// Should fail under --noPropertyAccessFromIndexSignature
console.log(x.z);
const m: boolean = x.m;

// Should be 'm'
type M = keyof typeof x;

// Should be able to detect a failure here
const x2 = {
    m: true,
    s: "false"
} satisfies Facts;
