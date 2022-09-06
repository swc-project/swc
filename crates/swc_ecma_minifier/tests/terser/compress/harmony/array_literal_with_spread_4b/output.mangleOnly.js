var o = [];
function l(o) {
    console.log("(" + o + ")");
    return 10 * o;
}
console.log([l(1), l(2)][0]);
console.log([l(1), l(2)][1]);
console.log([l(1), l(2)][2]);
console.log([...o, l(1), l(2)][0]);
console.log([...o, l(1), l(2)][1]);
console.log([...o, l(1), l(2)][2]);
console.log([l(1), ...o, l(2)][0]);
console.log([l(1), ...o, l(2)][1]);
console.log([l(1), ...o, l(2)][2]);
console.log([l(1), l(2), ...o][0]);
console.log([l(1), l(2), ...o][1]);
console.log([l(1), l(2), ...o][2]);
