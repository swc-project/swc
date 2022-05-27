var a = function(a) {
    console.log(a);
};
a((function() {
    console.log("PASS");
    return "FAIL";
})());
