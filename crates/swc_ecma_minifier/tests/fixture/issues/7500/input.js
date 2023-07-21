var globalArray = [1, 1, 1];
module.exports = function () {
    var localArray = globalArray;
    localArray[0] = localArray[1] = localArray[2] = 0;
    return localArray;
};