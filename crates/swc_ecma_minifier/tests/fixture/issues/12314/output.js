if (true) {
    var globallyVisible = 1;
    console.log("inside");
}
var directlyVisible = 2;
function local() {
    var l = globallyVisible;
    return l;
}
console.log(globallyVisible, directlyVisible, local());
