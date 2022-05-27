let a = {
    ...{}
};
console.log(Object.keys(a));
let b = {
    a: 1,
    ...{
        b: 2
    }
};
console.log(Object.keys(b).join(","));
