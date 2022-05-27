var d;
function a(a) {
    console.log(d === a);
    d = a;
}
function b() {}
for(var c = 3; --c >= 0;)a(b);
