const callbacks = [];
for(const key in {
    first: 1,
    second: 2,
    third: 3
}){
    let value;
    callbacks.push((value = key, ()=>value));
}
for (const value of [
    1,
    2,
    3
]){
    let value1;
    callbacks.push((value1 = value, ()=>value1));
}
let i = 0;
while(i < 3){
    let value;
    callbacks.push((value = ++i, ()=>value));
}
i = 0;
do {
    let value;
    callbacks.push((value = ++i, ()=>value));
}while (i < 3)
console.log(callbacks.map((cb)=>cb()).join(","));
