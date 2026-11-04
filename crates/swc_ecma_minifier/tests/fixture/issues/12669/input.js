async function f(q) { return q + 1 }
export function C(p) { return (function (g = f) { return g })(p.s) }
