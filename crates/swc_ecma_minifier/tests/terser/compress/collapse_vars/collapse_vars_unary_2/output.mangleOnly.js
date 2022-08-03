global.leak = (l)=>console.log(l);
global.num = 4;
let l = -1;
for(const n in [
    0,
    1,
    2,
    3,
    4,
    5
]){
    l++, n == num && leak(l);
}
