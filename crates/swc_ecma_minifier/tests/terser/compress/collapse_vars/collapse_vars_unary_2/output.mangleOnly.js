global.leak = (l) => console.log(l);
global.num = 4;
let l = -1;
for (const o in [0, 1, 2, 3, 4, 5]) {
    l++, o == num && leak(l);
}
