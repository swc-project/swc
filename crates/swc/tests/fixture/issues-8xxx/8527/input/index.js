function foo({ a: { ...b } = {} }) {
    console.log(b);
}

foo({}); // should log `{}` but throws `Uncaught TypeError: Cannot destructure undefined`