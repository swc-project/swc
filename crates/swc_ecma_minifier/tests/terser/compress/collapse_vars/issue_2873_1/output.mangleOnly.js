var o = 1,
    e = 0;
do {
    e++;
    if (!--o) break;
    e = 1 + e;
} while (0);
console.log(o, e);
