// @strict: true
// @declaration: true
function ft1(s, n, u, t) {
    const c1 = `abc${s}`; // `abc${string}`
    const c2 = `abc${n}`; // `abc${number}`
    const c3 = `abc${u}`; // "abcfoo" | "abcbar" | "abcbaz"
    const c4 = `abc${t}`; // `abc${T}
    const d1 = `abc${s}`;
    const d2 = `abc${n}`;
    const d3 = `abc${u}`;
    const d4 = `abc${t}`;
}
function ft2(s) {
    return `abc${s}`;
}
function ft10(s) {
    const c1 = `abc${s}`; // Widening type `abc${string}`
    let v1 = c1; // Type string
    const c2 = c1; // Widening type `abc${string}`
    let v2 = c2; // Type string
    const c3 = `abc${s}`;
    let v3 = c3; // Type `abc${string}`
    const c4 = c1; // Type `abc${string}`
    let v4 = c4; // Type `abc${string}`
}
function ft11(s, cond) {
    const c1 = cond ? `foo${s}` : `bar${s}`; // widening `foo${string}` | widening `bar${string}`
    const c2 = c1; // `foo${string}` | `bar${string}`
    const c3 = cond ? c1 : c2; // `foo${string}` | `bar${string}`
    const c4 = cond ? c3 : `baz${s}`; // `foo${string}` | `bar${string}` | widening `baz${string}`
    const c5 = c4; // `foo${string}` | `bar${string}` | `baz${string}`
    let v1 = c1; // string
    let v2 = c2; // `foo${string}` | `bar${string}`
    let v3 = c3; // `foo${string}` | `bar${string}`
    let v4 = c4; // string
    let v5 = c5; // `foo${string}` | `bar${string}` | `baz${string}`
}
function ft12(s) {
    const c1 = `foo${s}`;
    let v1 = c1;
    const c2 = `foo${s}`;
    let v2 = c2;
    const c3 = `foo${s}`;
    let v3 = c3;
    const c4 = `foo${s}`;
    let v4 = c4;
    const c5 = `foo${s}`;
    let v5 = c5;
}
function ft13(s, cond) {
    let x1 = widening(`foo${s}`);
    let x2 = widening(cond ? 'a' : `foo${s}`);
    let y1 = nonWidening(`foo${s}`);
    let y2 = nonWidening(cond ? 'a' : `foo${s}`);
}
function ft14(t) {
    let x1 = t;
    let x2 = t;
    let x3 = t;
    let x4 = t;
    let x6 = t;
}
const t1 = takesLiteral("foo.bar.baz"); // "baz"
const id2 = "foo.bar.baz";
const t2 = takesLiteral(id2); // "baz"
const t3 = takesLiteral(`foo.bar.${someString}`); // string
const id4 = `foo.bar.${someString}`;
const t4 = takesLiteral(id4); // string
const t5 = takesLiteral(`foo.bar.${someUnion}`); // "abc" | "def" | "ghi"
// Repro from #41732
const pixelValue = 22;
const pixelString = `22px`;
const pixelStringWithTemplate = `${pixelValue}px`;
