let source = [undefined, 2];
let value, tail;
const original = source;
function change() {
    source = [3, 4];
    return 1;
}
const result = ([...{ 0: value = change(), ...tail }] = source);
console.log(result === original, value, JSON.stringify(source), JSON.stringify(tail));
