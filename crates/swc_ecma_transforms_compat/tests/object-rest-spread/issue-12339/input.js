const [...{ ...direct }] = [1, 2];
const [...{ 0: { ...nestedObject } }] = [{ a: 1 }];
const [...[{ ...nestedArray }]] = [{ a: 1 }];
console.log(JSON.stringify([direct, nestedObject, nestedArray]));

const [head, , ...{ 0: first, ...tail }] = [0, 1, 2, 3, 4];
console.log(JSON.stringify([head, first, tail]));

let assigned;
const source = [1, 2];
const result = ([...{ ...assigned }] = source);
console.log(result === source, JSON.stringify(assigned));

function unpack([...{ ...rest }]) {
    return rest;
}
console.log(JSON.stringify(unpack([3, 4])));

for (const [...[{ ...rest }]] of [[{ b: 2 }]]) {
    console.log(JSON.stringify(rest));
}

let calls = 0;
function* values() {
    calls++;
    yield 0;
    calls++;
    yield 1;
    calls++;
    yield 2;
}
const [initial, ...{ ...remaining }] = values();
console.log(initial, calls, JSON.stringify(remaining));
