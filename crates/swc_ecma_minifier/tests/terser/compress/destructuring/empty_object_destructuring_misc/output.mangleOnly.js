let a = [], b = (a.push(0), 1), {} = {
    k: 9
}, c = a.push(2), { unused: d  } = (a.push(3), {
    unused: 7
}), { a: e , prop: f , w: g , x: h , z: i  } = {
    prop: 8
}, j = (a.push(4), 5);
console.log(`${b} ${f} ${j} ${JSON.stringify(a)}`);
