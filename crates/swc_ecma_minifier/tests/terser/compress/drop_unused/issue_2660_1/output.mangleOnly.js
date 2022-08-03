var n = 2;
function r(o) {
    return (o && r()) || n--;
}
r(1);
console.log(n);
