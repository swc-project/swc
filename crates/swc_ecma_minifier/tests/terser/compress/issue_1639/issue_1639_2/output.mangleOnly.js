var f = 100,
    i = 10;
function o() {
    if ((++f, false)) if (f) if (++f);
}
o();
console.log(f, i);
