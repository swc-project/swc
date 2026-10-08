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
expect(result).toBe(7);
expect(object.value).toBe(4);
expect(N.value).toBe(3);
