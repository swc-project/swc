export function assertNever(x, msg) {
    throw Error("Unexpected " + msg);
}
