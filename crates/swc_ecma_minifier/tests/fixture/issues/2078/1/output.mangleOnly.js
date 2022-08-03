let l = [
    1
];
let e;
while(l.length > 0){
    e = l.sort();
    l = [];
    e.forEach((l)=>console.log(l));
}
