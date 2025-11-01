function f() {
    let a = 1;
    do (function() {
        a && (c = "PASS");
    })();
    while (a = 0)
}
var c = "FAIL";
f();
console.log(c);
