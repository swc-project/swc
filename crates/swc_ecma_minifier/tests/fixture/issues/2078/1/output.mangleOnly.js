let a = [
    1
];
let b;
while(a.length > 0){
    b = a.sort();
    a = [];
    b.forEach((a)=>console.log(a));
}
