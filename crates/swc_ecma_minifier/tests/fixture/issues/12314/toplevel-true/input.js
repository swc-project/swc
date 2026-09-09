if (true) {
    var globallyVisible = 1;
    console.log("inside");
}

var directlyVisible = 2;

function local() {
    var functionLocal = globallyVisible;
    return functionLocal;
}

console.log(globallyVisible, directlyVisible, local());
