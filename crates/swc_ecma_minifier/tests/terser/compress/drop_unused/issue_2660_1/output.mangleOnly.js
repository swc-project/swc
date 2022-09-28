var n = 2;
function o(r) {
    return (r && o()) || n--;
}
o(1);
console.log(n);
