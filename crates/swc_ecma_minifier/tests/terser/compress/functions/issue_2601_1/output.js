var a = "FAIL";
(function() {
    let b;
    b && b(), a = "PASS";
})(), console.log(a);
