var a = 1, e = 0;
do {
    e++;
    if (!--a) break;
    e = 1 + e;
}while (0)
console.log(a, e);
