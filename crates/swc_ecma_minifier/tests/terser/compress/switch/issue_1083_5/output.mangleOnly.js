function e(e, a) {
    switch(true){
        default:
            console.log("definitely");
            break;
        case a:
            console.log("maybe");
            break;
        case e:
            console.log("definitely");
            break;
    }
}
e(true, false);
e(true, true);
