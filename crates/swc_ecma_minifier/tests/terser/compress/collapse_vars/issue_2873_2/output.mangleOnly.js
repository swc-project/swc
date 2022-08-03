var i = 1, o = 0;
do {
    o++;
    if (!--i) continue;
    o = 1 + o;
}while (0)
console.log(i, o);
