function e(e, t) {
    switch(true){
        case t:
            console.log("maybe");
            break;
        default:
        case e:
            console.log("definitely");
            break;
    }
}
e(true, false);
e(true, true);
