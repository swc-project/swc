declare const t1: [number, string, ...boolean[]];
declare const t2: [string, ...boolean[]];
declare const t3: [...boolean[]];
declare const t4: [];

declare const f20: <T extends unknown[]>(...args: T) => T;

const e1 = f20(...t1);
const e2 = f20(42, ...t2);
const e3 = f20(42, "hello", ...t3);
const e4 = f20(42, "hello", ...t2, true);
