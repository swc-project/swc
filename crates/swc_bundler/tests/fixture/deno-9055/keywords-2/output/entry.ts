const x = {
    n: 123,
    t: "text",
    int: "==INT=="
};
const { n, t, __int = 5 } = x;
console.log(n, t, __int);
