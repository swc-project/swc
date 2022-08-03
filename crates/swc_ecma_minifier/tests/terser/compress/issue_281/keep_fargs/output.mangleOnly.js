var a = 1;
!(function(n) {
    a++;
})(a++ + (a && a.var));
console.log(a);
