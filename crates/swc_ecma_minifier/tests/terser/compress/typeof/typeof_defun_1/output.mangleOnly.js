function n() {
    console.log("YES");
}
function o() {
    c = 42;
    console.log("NOPE");
}
function c() {
    console.log("YUP");
}
o = 42;
"function" == typeof n && n();
"function" == typeof o && o();
"function" == typeof c && c();
