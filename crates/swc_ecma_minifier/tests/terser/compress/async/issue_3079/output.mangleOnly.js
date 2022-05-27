(a)=>1;
var a = (a)=>a;
console.log(a(1));
a = (a)=>a;
console.log(a(2));
console.log({
    m: (a)=>(a ? "3" : "4")
}.m(true));
