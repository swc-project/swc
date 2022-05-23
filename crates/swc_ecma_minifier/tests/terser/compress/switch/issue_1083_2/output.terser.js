function test(definitely_true, maybe_true) {
    switch (true) {
        case definitely_true:
        default:
            console.log("PASS");
            break;
        case maybe_true:
            console.log("FAIL");
    }
}
test(true, false);
test(true, true);
