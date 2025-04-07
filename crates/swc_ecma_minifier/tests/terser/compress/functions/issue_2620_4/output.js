var c = "FAIL";
(function() {
    var a = 0 / 0;
    switch(a){
        case a:
        case void (c = "PASS"):
    }
})();
console.log(c);
