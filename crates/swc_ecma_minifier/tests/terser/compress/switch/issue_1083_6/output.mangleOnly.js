function a(a, b) {
    switch(true){
        case a:
            console.log("definitely");
            break;
        case b:
            console.log("maybe");
            break;
        default:
            console.log("definitely");
            break;
    }
}
a(true, false);
a(true, true);
