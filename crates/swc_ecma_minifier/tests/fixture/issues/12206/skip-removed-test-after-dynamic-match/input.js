function f() {
    return 1;
}

switch (1) {
    case f():
    case (console.log("removed"), 2):
    case 1:
        console.log("hit");
}
