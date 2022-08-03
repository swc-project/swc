function t(t) {
    switch(t){
        case "bar":
            return "PASS";
        default:
            return "FAIL";
    }
}
console.log(t("bar"));
