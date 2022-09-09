function e(e, t) {
    switch (true) {
        case t:
            console.log("maybe");
            break;
        case e:
        default:
            console.log("definitely");
            break;
    }
}
e(true, false);
e(true, true);
