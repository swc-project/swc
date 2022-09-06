function e(e, o) {
    switch (true) {
        case e:
        default:
            console.log("PASS");
            break;
        case o:
            console.log("FAIL");
            break;
    }
}
e(true, false);
e(true, true);
