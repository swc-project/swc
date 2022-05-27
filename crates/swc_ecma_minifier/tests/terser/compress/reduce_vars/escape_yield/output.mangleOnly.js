function a() {
    var a = d.next().value;
    if (a !== (a = d.next().value)) console.log("FAIL");
    else console.log("PASS");
}
function c() {}
function* b(a) {
    for(;;)yield c;
}
var d = b();
a();
