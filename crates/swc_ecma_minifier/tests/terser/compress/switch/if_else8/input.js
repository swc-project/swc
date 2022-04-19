function test(foo) {
    switch (foo) {
        case "bar":
            return "PASS";
        default:
            return "FAIL";
    }
}
console.log(test("bar"));
