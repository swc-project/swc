var a = 1;
!(function(b) {
    a++;
})(a++ + (a && a.var));
console.log(a);
