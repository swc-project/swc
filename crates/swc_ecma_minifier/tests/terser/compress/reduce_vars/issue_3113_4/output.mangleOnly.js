var n = 0, o = 0;
function $() {
    o += n;
}
$($(), ++n);
console.log(n, o);
