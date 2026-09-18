if (true) {
    var globallyVisible = 1;
    let blockScoped = 3;
    console.log("inside", blockScoped);
}

var directlyVisible = 2;

function local() {
    var functionLocal = globallyVisible;
    return functionLocal;
}

console.log(globallyVisible, directlyVisible, local());
