function o() {
    console.log("YES");
}
function n() {
    c = 42;
    console.log("NOPE");
}
function c() {
    console.log("YUP");
}
n = 42;
"function" == typeof o && o();
"function" == typeof n && n();
"function" == typeof c && c();
