var a = 1;
function g() {
    a-- && g();
}
g();
console.log(a);
