var nothing = [];
function t(x) {
    console.log("(" + x + ")");
    return 10 * x;
}
console.log([t(1), t(2)][0]);
console.log([t(1), t(2)][1]);
console.log([t(1), t(2)][2]);
console.log([...nothing, t(1), t(2)][0]);
console.log([...nothing, t(1), t(2)][1]);
console.log([...nothing, t(1), t(2)][2]);
console.log([t(1), ...nothing, t(2)][0]);
console.log([t(1), ...nothing, t(2)][1]);
console.log([t(1), ...nothing, t(2)][2]);
console.log([t(1), t(2), ...nothing][0]);
console.log([t(1), t(2), ...nothing][1]);
console.log([t(1), t(2), ...nothing][2]);
