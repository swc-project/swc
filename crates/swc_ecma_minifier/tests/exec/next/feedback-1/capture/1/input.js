
const arr = [];
const fns = [];

var _loop = function (i) {
    fns.push(() => {
        arr.push(i);
    })
}
for (var i = 0; i < 10; i++) _loop(i);

fns.forEach(fn => fn());

console.log(arr);
