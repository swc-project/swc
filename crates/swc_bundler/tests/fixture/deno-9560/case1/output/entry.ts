const water = "Water";
function isWater(x) {
    return x === water;
}
const mod = {
    water: water,
    isWater: isWater
};
function foo(x) {
    return mod[x];
}
export { foo as foo };
export { isWater as isWater };
