let {
    foo: [, , ...o],
} = { foo: [1, 2, 3, 4], bar: 5 };
console.log(o);
