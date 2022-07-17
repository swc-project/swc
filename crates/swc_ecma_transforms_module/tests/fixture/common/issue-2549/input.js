function log() {
    console.log("unexported");
}

export function noassign() {
    console.log("stub");
}

export function warn() {
    throw new Error("this should not be called");
}

export const errors = {
    a: 1,
};

export const addOne = (x) => `${x + 1}`;
export const someFunc = (x) => `The answer is : ${addOne(x)}`;

export const test = {};

Object.defineProperty(test, "log", {
    get: function get() {
        return log;
    },
    set: function set(v) {
        log = v;
    },
});

Object.defineProperty(test, "warn", {
    get: () => warn,
    set: (v) => {
        warn = v;
    },
});

Object.defineProperty(test, "errors", {
    get: () => errors,
    set: (v) => {
        errors = v;
    },
});
