function e(e, l) {
    switch (true) {
        case e:
            console.log("definitely");
            break;
        case l:
            console.log("maybe");
            break;
        default:
            console.log("definitely");
            break;
    }
}
e(true, false);
e(true, true);
