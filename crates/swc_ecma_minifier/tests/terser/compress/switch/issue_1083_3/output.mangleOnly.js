function a(a, b) {
    switch(true){
        case b:
            console.log("maybe");
            break;
        default:
        case a:
            console.log("definitely");
            break;
    }
}
a(true, false);
a(true, true);
