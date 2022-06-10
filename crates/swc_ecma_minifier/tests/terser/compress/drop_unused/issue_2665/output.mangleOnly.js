var a = 1;
function b() {
    a-- && b();
}
typeof c == "function" && c();
function c() {
    typeof b == "function" && b();
}
console.log(a);
