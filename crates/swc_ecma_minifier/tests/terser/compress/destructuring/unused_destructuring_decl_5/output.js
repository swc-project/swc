const { a: a , b: c , d: d = Object(1)  } = {
    b: 7
};
let { e: e , h: h = Object(2)  } = {
    e: 8
};
var { w: w , z: z = Object(3)  } = {
    w: 4,
    x: 5,
    y: 6
};
console.log(c, e, z + 0);
