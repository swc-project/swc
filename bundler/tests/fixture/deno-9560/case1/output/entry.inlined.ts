const water = 'Water';
function isWater1(x) {
    return x === water;
}
const mod = function() {
    return {
        water: water,
        isWater: isWater1
    };
}();
function foo1(x) {
    return mod[x];
}
export { foo1 as foo };
export { isWater1 as isWater };
