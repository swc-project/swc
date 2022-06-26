class Bar {
    constructor(input){}
}
export { Bar };
// @filename: usage.ts
export const x = {
    x: 0,
    y: 0
};
export let y = {
    a: "",
    b: 0
};
export class Bar2 {
    constructor(input){}
}
export let shim = {
    Bar: Bar2
};
module.exports = Point;
