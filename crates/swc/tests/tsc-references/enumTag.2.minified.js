//// [a.js]
var Target = {
    START: "start",
    MIDDLE: "middle",
    END: "end",
    MISTAKE: 1,
    OK_I_GUESS: 2
}, Second = {
    MISTAKE: "end",
    OK: 1,
    FINE: 2
}, Fs = {
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
function consume(t, s, f) {
    Target.START, Target.UNKNOWN, Second.MISTAKE;
}
function ff(s) {
    return Target[s] ? Target[s] : null;
}
