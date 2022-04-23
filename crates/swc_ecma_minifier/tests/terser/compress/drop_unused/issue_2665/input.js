var a = 1;
function g() {
    a-- && g();
}
typeof h == "function" && h();
function h() {
    typeof g == "function" && g();
}
console.log(a);
