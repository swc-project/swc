export { foo as foo1, bar };
export { foo, bar as bar2 };

const foo = 1;
let bar = 2;

export default bar;

bar = 3;
