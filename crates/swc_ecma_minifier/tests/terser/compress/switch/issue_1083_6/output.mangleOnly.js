function e(e, a) {
    switch(true){
        case e:
            console.log("definitely");
            break;
        case a:
            console.log("maybe");
            break;
        default:
            console.log("definitely");
            break;
    }
}
e(true, false);
e(true, true);
