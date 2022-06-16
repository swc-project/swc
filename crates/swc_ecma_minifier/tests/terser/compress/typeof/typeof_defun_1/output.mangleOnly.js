function a() {
    console.log("YES");
}
function b() {
    c = 42;
    console.log("NOPE");
}
function c() {
    console.log("YUP");
}
b = 42;
"function" == typeof a && a();
"function" == typeof b && b();
"function" == typeof c && c();
