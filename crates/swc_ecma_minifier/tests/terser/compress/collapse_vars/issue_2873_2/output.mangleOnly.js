var b = 1, a = 0;
do {
    a++;
    if (!--b) continue;
    a = 1 + a;
}while (0)
console.log(b, a);
