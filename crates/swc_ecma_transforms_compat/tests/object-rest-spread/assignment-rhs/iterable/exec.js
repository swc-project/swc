const original = new Set([1, 2]);
let calls = 0;
function source() {
    calls++;
    return original;
}
let value, tail;
const result = ([...{ 0: value, ...tail }] = source());
console.log(result === original, calls, value, JSON.stringify(tail));
