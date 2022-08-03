var n = 1;
n++;
((function() {} || n || 3).toString());
console.log(n);
