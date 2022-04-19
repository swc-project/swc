function test(definitely_true, maybe_true) {
    if (true === maybe_true) console.log("maybe");
    else console.log("definitely");
}
test(true, false);
test(true, true);
