function n() {
    console.log("YES");
}
function o() {
    f = 42;
    console.log("NOPE");
}
function f() {
    console.log("YUP");
}
o = 42;
"function" == typeof n && n();
"function" == typeof o && o();
"function" == typeof f && f();
