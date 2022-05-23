function test(definitely_true, maybe_true) {
    switch (true) {
        case definitely_true:
            console.log("definitely");
            break;
        case maybe_true:
            console.log("maybe");
            break;
        default:
            console.log("definitely");
            break;
    }
}
test(true, false);
test(true, true);
