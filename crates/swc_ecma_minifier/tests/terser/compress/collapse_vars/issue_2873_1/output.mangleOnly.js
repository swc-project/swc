var a = 1, b = 0;
do {
    b++;
    if (!--a) break;
    b = 1 + b;
}while (0)
console.log(a, b);
