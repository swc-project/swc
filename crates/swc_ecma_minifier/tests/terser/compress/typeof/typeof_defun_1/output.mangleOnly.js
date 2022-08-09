function o() {
    console.log("YES");
}
function f() {
    n = 42;
    console.log("NOPE");
}
function n() {
    console.log("YUP");
}
f = 42;
"function" == typeof o && o();
"function" == typeof f && f();
"function" == typeof n && n();
