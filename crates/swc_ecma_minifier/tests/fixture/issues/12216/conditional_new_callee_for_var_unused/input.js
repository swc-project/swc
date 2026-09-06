function sideEffect() {
    console.log("effect");
}

function condition() {
    return false;
}

function run() {
    for (var x = sideEffect(); condition(); ) {}
}
