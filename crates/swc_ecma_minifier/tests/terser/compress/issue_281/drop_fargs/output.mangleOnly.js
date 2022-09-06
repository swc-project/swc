var o = 1;
!(function (n) {
    o++;
})(o++ + (o && o.var));
console.log(o);
