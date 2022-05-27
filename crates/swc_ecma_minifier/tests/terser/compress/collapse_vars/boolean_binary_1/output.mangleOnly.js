var a = 1;
a++;
((function() {} || a || 3).toString());
console.log(a);
