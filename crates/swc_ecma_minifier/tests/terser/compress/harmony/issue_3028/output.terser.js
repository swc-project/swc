function a(array) {
    var shifted = array.splice(0, 2);
    return [...array, ...shifted];
}
console.log(a([1, 2, 3]).join(" "));
