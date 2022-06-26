const { a: a , b: b , d: c = new Object(1)  } = {
    b: 7
};
let { e: d , f: e , h: f = new Object(2)  } = {
    e: 8
};
var { w: g , x: h , z: i = new Object(3)  } = {
    w: 4,
    x: 5,
    y: 6
};
console.log(b, d, i + 0);
