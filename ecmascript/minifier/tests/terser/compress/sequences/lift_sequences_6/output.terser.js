var a = 2;
(a &&= (leak(), (a = 4), 3)), console.log(a);
