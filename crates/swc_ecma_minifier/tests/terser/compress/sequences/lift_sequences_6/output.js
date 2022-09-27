var a = 2;
console.log(a &&= (leak(), a = 4, 3));
