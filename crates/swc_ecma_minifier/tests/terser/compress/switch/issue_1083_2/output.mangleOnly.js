function e(e, t) {
    switch(true){
        case e:
        default:
            console.log("PASS");
            break;
        case t:
            console.log("FAIL");
            break;
    }
}
e(true, false);
e(true, true);
