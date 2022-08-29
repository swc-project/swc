var n = 1;
function o() {
    n-- && o();
}
typeof f == "function" && f();
function f() {
    typeof o == "function" && o();
}
console.log(n);
