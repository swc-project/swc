console.log("okay");
console.log(function(x, y, z) {
    return 123;
}());
console.log(function(x, y, z) {}());
console.log(function(x, y, z) {
    return 2;
}(0, 0, 0));
console.log(function(x, y) {
    return 6;
}(0, 0));
console.log(function(x, y) {
    return 6;
}(0, 0, a(), b()));
