[...a, b] = [...spread];
const [...a, b] = [...spread];
([...a, b]) => {};
({ ...a, b }) => {};
(...a, b) => {};
class c {
    constructor(...a, b) {}
    fn(...a, b) {}
}
function fn([...a, b]) {}
function fn({ ...a, b }) {}
function fn(...a, b) {}
({ ...a, b } = { ...spread });
const { ...a, b } = { ...spread };
for ([...a,b,] of a) {}
for ({...a,b,} of b) {}