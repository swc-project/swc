function a() {
    var a = d.next().value;
    if (a !== (a = d.next().value)) console.log("FAIL");
    else console.log("PASS");
}
function b() {}
function* c(a) {
    for(;;)yield b;
}
var d = c();
a();
