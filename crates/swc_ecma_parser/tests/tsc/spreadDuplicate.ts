// @strict: true
// @declaration: true

// Repro from #44438

declare let a: { a: string };
declare let b: { a?: string };
declare let c: { a: string | undefined };
declare let d: { a?: string | undefined };

declare let t: boolean;

let a1 = { a: 123, ...a };  // string (Error)
let b1 = { a: 123, ...b };  // string | number
let c1 = { a: 123, ...c };  // string | undefined (Error)
let d1 = { a: 123, ...d };  // string | number

let a2 = { a: 123, ...(t ? a : {}) };  // string | number
let b2 = { a: 123, ...(t ? b : {}) };  // string | number
let c2 = { a: 123, ...(t ? c : {}) };  // string | number
let d2 = { a: 123, ...(t ? d : {}) };  // string | number
