function r(r) {
    switch (r) {
        case "bar":
            return "PASS";
        default:
            return "FAIL";
    }
}
console.log(r("bar"));
