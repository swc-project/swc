function a(a, b) {
    switch(true){
        case b:
            console.log("maybe");
            break;
        case a:
        default:
            console.log("definitely");
            break;
    }
}
a(true, false);
a(true, true);
