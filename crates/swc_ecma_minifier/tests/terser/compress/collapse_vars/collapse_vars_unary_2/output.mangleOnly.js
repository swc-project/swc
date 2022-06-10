global.leak = (a)=>console.log(a);
global.num = 4;
let a = -1;
for(const b in [
    0,
    1,
    2,
    3,
    4,
    5
]){
    a++, b == num && leak(a);
}
