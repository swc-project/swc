const { a: a , b: b , ...c } = {
    b: 7
};
let { e: d , f: e , ...f } = {
    e: 8
};
var { w: g , x: h , ...i } = {
    w: 4,
    x: 5,
    y: 6
};
console.log(b, d, i.y);
