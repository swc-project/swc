function t(x) {
    console.log("(" + x + ")");
    return 10 * x;
}
console.log([t(1), t(2)][0]);
console.log([t(1), t(2)][1]);
console.log([t(1), t(2)][2]);
console.log([...[], t(1), t(2)][0]);
console.log([...[], t(1), t(2)][1]);
console.log([...[], t(1), t(2)][2]);
console.log([t(1), ...[], t(2)][0]);
console.log([t(1), ...[], t(2)][1]);
console.log([t(1), ...[], t(2)][2]);
console.log([t(1), t(2), ...[]][0]);
console.log([t(1), t(2), ...[]][1]);
console.log([t(1), t(2), ...[]][2]);
