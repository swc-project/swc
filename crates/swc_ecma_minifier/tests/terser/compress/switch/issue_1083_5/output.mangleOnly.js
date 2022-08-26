function e(e, t) {
    switch(true){
        default:
            console.log("definitely");
            break;
        case t:
            console.log("maybe");
            break;
        case e:
            console.log("definitely");
            break;
    }
}
e(true, false);
e(true, true);
