var b = 1,
    c = 0;
do {
    c++;
    if (!--b) continue;
    c = 1 + c;
} while (0);
console.log(b, c);
