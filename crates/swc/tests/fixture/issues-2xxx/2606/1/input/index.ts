export function warn() {
    throw new Error("this should not be called");
}
export const test = {};
export const test2 = {};
Object.defineProperty(test, "warn", {
    get: () => warn,
    set: (v) => {
        (warn as any) = v;
    },
});
Object.defineProperty(test2, "work", {
    get: () => warn,
    set: (v) => {
        warn = v;
    },
});
