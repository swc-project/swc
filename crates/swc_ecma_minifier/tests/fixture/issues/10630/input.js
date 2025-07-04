var constants = {
    first: 1,
    second: 2
}
export function isConstant(x) {
    return x === constants.first || x === constants.second;
}
var y = constants.second;