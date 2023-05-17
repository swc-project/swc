export function mutate(out) {
    return out[0] = 1, out[1] = 2, out[2] = 3, out;
}
export const myFunc = function() {
    const temp = [
        0,
        0,
        0
    ];
    return function(out) {
        return mutate(temp), out[0] = 1 / temp[0], out[1] = 1 / temp[1], out[2] = 1 / temp[2], out;
    };
}();
const out = [
    1,
    2,
    3
];
myFunc(out);
