function a(a, b) {
    switch(true){
        default:
            console.log("definitely");
            break;
        case b:
            console.log("maybe");
            break;
        case a:
            console.log("definitely");
            break;
    }
}
a(true, false);
a(true, true);
