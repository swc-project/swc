function f() {
    console.log(a);
}
while(function() {
    f();
}());
var a = 1;
f();
