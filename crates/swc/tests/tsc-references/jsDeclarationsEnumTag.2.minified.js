//// [index.js]
export var Target = {
    START: "start",
    MIDDLE: "middle",
    END: "end",
    OK_I_GUESS: 2
};
export var Second = {
    OK: 1,
    FINE: 2
};
export var Fs = {
    ADD1: function(n) {
        return n + 1;
    },
    ID: function(n) {
        return n;
    },
    SUB1: function(n) {
        return n - 1;
    }
};
export function consume(t, s, f) {
    Target.START;
}
export function ff(s) {
    return Target[s] ? Target[s] : null;
}
