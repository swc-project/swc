function a(a) {
    switch(a){
        case "bar":
            return "PASS";
        default:
            return "FAIL";
    }
}
console.log(a("bar"));
