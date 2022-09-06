function o(o) {
    console.log("(" + o + ")");
    return 10 * o;
}
console.log([o(1), o(2)][0]);
console.log([o(1), o(2)][1]);
console.log([o(1), o(2)][2]);
console.log([...[], o(1), o(2)][0]);
console.log([...[], o(1), o(2)][1]);
console.log([...[], o(1), o(2)][2]);
console.log([o(1), ...[], o(2)][0]);
console.log([o(1), ...[], o(2)][1]);
console.log([o(1), ...[], o(2)][2]);
console.log([o(1), o(2), ...[]][0]);
console.log([o(1), o(2), ...[]][1]);
console.log([o(1), o(2), ...[]][2]);
