var l = 2;
l &&= (leak(), (l = 4), 3);
console.log(l);
