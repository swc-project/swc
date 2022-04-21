function test(definitely_true, maybe_true) {
    switch (true) {
        case maybe_true:
            console.log("maybe");
            break;
        default:
        case definitely_true:
            console.log("definitely");
            break;
    }
}
test(true, false);
test(true, true);
