export const Target = {
    START: "start",
    MIDDLE: "middle",
    END: "end",
    OK_I_GUESS: 2
};
export const Second = {
    OK: 1,
    FINE: 2
};
export const Fs = {
    ADD1: (n)=>n + 1,
    ID: (n)=>n,
    SUB1: (n)=>n - 1
};
export function consume() {
    Target.START;
}
export function ff(s) {
    return Target[s] ? Target[s] : null;
}
