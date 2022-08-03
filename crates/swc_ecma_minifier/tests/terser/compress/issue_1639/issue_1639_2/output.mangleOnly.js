var f = 100, i = 10;
function $() {
    if ((++f, false)) if (f) if (++f) ;
}
$();
console.log(f, i);
