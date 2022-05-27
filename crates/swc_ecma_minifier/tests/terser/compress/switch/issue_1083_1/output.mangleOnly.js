function a(a, b) {
    switch(true){
        case a:
        default:
            console.log("PASS");
            break;
        case b:
            console.log("FAIL");
            break;
    }
}
a(true, false);
a(true, true);
