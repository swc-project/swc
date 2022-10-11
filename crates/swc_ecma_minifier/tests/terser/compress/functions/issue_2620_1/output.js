var c = "FAIL";
(function(a) {
    var a1;
    a1 && a1(), c = "PASS";
})(1), console.log(c);
