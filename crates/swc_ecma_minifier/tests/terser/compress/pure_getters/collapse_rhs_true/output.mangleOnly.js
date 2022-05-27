console.log((((42).length = "PASS"), "PASS"));
console.log((("foo".length = "PASS"), "PASS"));
console.log(((false.length = "PASS"), "PASS"));
console.log(((function() {}.length = "PASS"), "PASS"));
console.log((({
    get length () {
        return "FAIL";
    }
}.length = "PASS"), "PASS"));
