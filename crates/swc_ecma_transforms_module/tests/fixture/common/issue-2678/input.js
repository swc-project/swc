export default function someCall() {
    throw new Error("this should not be called");
}

export function warn() {
    throw new Error("this should not be called");
}

export const test = {};
Object.defineProperty(test, "someCall", {
    set: (v) => {
        someCall = v;
    },
});

Object.defineProperty(test, "warn", {
    get: () => warn,
    set: (v) => {
        warn = v;
    },
});
