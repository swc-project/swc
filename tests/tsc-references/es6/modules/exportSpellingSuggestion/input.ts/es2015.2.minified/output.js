export function assertNever(x, msg) {
    throw new Error("Unexpected " + msg);
}
