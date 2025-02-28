var o = 1;
function f() {
    o-- && f();
}
typeof n == "function" && n();
function n() {
    typeof f == "function" && f();
}
console.log(o);
