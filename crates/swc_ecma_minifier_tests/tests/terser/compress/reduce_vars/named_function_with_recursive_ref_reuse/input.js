var result = [];
var do_not_inline = function foo() {
    result.push(foo);
};
[0, 1].map(() => do_not_inline());
console.log(result[0] === result[1]);
