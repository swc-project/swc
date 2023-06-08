var globalArray = [
    1,
    1,
    1
];
module.exports = function() {
    return globalArray[0] = globalArray[1] = globalArray[2] = 0, globalArray;
};
