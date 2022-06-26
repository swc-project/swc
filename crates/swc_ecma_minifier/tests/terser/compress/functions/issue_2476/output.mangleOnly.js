function a(a, b, c) {
    return a < b ? a * b + c : a * c - b;
}
for(var b = 0, c = 0; c < 10; c++)b += a(c, c + 1, 3 * c);
console.log(b);
