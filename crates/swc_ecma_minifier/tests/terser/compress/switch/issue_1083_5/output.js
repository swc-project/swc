function test(definitely_true, maybe_true) {
    switch(true){
        default:
        case maybe_true:
            console.log("maybe");
            break;
        case definitely_true:
            console.log("definitely");
    }
}
test(true, false);
test(true, true);
