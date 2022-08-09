var n = 0;
n += 1;
((function() {
    n = 1 + n;
} || 9).toString());
console.log(n);
