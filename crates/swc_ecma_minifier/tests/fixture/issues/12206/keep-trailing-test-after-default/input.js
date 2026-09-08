function f() {
    return 1;
}

switch (1) {
    case f():
    default:
        console.log("body");
        break;
    case (console.log("later"), 2):
}
