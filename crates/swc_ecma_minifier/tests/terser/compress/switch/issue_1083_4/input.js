function test(definitely_true, maybe_true) {
    switch (true) {
        case maybe_true:
            console.log("maybe");
            break;
        case definitely_true:
        default:
            console.log("definitely");
            break;
    }
}
test(true, false);
test(true, true);
