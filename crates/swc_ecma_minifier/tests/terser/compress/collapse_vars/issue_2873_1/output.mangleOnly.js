var b = 1, a = 0;
do {
    a++;
    if (!--b) break;
    a = 1 + a;
}while (0)
console.log(b, a);
