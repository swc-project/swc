let e = {
    ...{}
};
console.log(Object.keys(e));
let l = {
    a: 1,
    ...{
        b: 2
    }
};
console.log(Object.keys(l).join(","));
