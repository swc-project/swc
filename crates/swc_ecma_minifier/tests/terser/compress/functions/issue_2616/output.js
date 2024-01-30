var c = "FAIL";
(true << []) - 0 / 0 || (c = "PASS");
console.log(c);
