(g)=>1;
var g = (g)=>g;
console.log(g(1));
g = (g)=>g;
console.log(g(2));
console.log({
    m: (g)=>(g ? "3" : "4")
}.m(true));
