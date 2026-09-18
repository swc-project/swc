if (true) {
    var globallyVisible = 1;
    let l = 3;
    console.log("inside", l);
}
var directlyVisible = 2;
function local() {
    var l = globallyVisible;
    return l;
}
console.log(globallyVisible, directlyVisible, local());
