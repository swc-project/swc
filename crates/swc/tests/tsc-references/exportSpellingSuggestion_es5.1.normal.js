// @filename: a.ts
export function assertNever(x, msg) {
    throw new Error("Unexpected " + msg);
}
