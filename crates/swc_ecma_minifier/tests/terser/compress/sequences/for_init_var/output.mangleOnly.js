var o = "PASS";
(function() {
    var r = 42;
    for(var a = 5; a > 0;)a--;
    o = "FAIL";
    var o;
})();
console.log(o);
