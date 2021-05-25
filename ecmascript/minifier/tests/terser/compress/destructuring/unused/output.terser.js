let {
    foo: [, , ...a],
} = { foo: [1, 2, 3, 4], bar: 5 };
console.log(a);
