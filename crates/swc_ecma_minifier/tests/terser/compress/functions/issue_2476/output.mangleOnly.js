function c(a, b, c) {
    return a < b ? a * b + c : a * c - b;
}
for(var b = 0, a = 0; a < 10; a++)b += c(a, a + 1, 3 * a);
console.log(b);
