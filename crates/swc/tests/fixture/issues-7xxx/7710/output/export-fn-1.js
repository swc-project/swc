let obj = {
    foo: 1,
    bar: 2
};
console.log(obj.bar);
export function check(test = obj) {
    console.log(test);
}
