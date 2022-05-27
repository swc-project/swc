let a = [], b = (a.push(0), 1), {} = {
    k: 9
}, e = a.push(2), { unused: f  } = (a.push(3), {
    unused: 7
}), { a: g , prop: c , w: h , x: i , z: j  } = {
    prop: 8
}, d = (a.push(4), 5);
console.log(`${b} ${c} ${d} ${JSON.stringify(a)}`);
