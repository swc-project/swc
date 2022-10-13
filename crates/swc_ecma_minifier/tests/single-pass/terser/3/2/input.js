var a = "FAIL";
!function () {
    var b;
    b && b(), a = "PASS";
}(), console.log(a);
