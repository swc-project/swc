var c = "FAIL";
(function(a) {
    var a1;
    a1 && a1(), c = "PASS";
})(0), console.log(c);
