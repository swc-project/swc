let obj = {
    foo: 1,
    bar: 2
};
console.log(obj.bar);
let default_export = obj;
export { default_export as default };
