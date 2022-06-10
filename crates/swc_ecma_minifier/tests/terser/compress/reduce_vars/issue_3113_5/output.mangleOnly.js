function a() {
    console.log(c);
}
function b() {
    a();
}
while(b());
var c = 1;
a();
