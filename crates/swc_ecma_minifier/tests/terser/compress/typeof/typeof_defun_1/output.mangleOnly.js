function b() {
    console.log("YES");
}
function a() {
    c = 42;
    console.log("NOPE");
}
function c() {
    console.log("YUP");
}
a = 42;
"function" == typeof b && b();
"function" == typeof a && a();
"function" == typeof c && c();
