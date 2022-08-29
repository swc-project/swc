//// [a.ts]
export function assertNever(x, msg) {
    throw Error("Unexpected " + msg);
}
//// [b.ts]
export { };
