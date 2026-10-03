namespace N {
    export const value = 3;
    export function read() { return value; }
}

function outside(value: number) {
    return value + N.read();
}

const value = 4;
const result = outside(value);
const object = { value };
console.log(result, object.value, N.value);
