declare const t1: [number, string, ...boolean[]];
declare const t2: [string, ...boolean[]];
declare const t3: [...boolean[]];
declare const t4: [];

declare let f00: (...x: [number, string, boolean]) => void;
declare let f01: (a: number, ...x: [string, boolean]) => void;
declare let f02: (a: number, b: string, ...x: [boolean]) => void;
declare let f03: (a: number, b: string, c: boolean) => void;
declare let f04: (a: number, b: string, c: boolean, ...x: []) => void;

declare let f10: (...x: [number, string, ...boolean[]]) => void;
declare let f11: (a: number, ...x: [string, ...boolean[]]) => void;
declare let f12: (a: number, b: string, ...x: [...boolean[]]) => void;
declare let f13: (a: number, b: string, ...c: boolean[]) => void;

declare const ns: [number, string];
declare const sn: [string, number];

const d1 = f13(42, "hello");
const d2 = f13(42, "hello", true);
const d3 = f13(42, "hello", true, false);
const d4 = f13(t1[0], t1[1], t1[2], t1[3]);
const d5 = f13(...t1);
const d6 = f13(42, ...t2);
const d7 = f13(42, "hello", ...t3);
const d8 = f13(42, "hello", true, ...t4);
const d9 = f13(42, "hello", true, ...t4, false, ...t3);
