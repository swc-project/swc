var a = 0;
a += 1;
((function() {
    a = 1 + a;
} || 9).toString());
console.log(a);
