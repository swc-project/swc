function f() {
    console.log("YES");
}
function g() {
    h = 42;
    console.log("NOPE");
}
function h() {
    console.log("YUP");
}
g = 42;
"function" == typeof f && f();
"function" == typeof g && g();
"function" == typeof h && h();
