var a = {
    get a () {
        return "PASS";
    }
};
a.a = "FAIL";
console.log(a.a);
