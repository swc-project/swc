function e(e, t) {
    switch(true){
        case e:
            console.log("definitely");
            break;
        case t:
            console.log("maybe");
            break;
        default:
            console.log("definitely");
            break;
    }
}
e(true, false);
e(true, true);
