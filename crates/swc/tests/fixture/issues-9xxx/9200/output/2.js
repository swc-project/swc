for(var a = (b in c) in {});
for(var a = 1 || (b in c) in {});
for(var a = 1 + (2 || (b in c)) in {});
for(var a = ()=>(b in c) in {});
for(var a = 1 || (()=>(b in c)) in {});
for(var a = ()=>{
    b in c;
} in {});
for(var a = [
    b in c
] in {});
for(var a = {
    b: b in c
} in {});
for(var a = (x = b in c)=>{} in {});
for(var a = class extends (b in c) {
} in {});
for(var a = function(x = b in c) {} in {});
for(var a = (b in c);;);
for(var a = 1 || (b in c);;);
for(var a = 1 + (2 || (b in c));;);
for(var a = ()=>(b in c);;);
for(var a = 1 || (()=>(b in c));;);
for(var a = ()=>{
    b in c;
};;);
for(var a = [
    b in c
];;);
for(var a = {
    b: b in c
};;);
for(var a = (x = b in c)=>{};;);
for(var a = class extends (b in c) {
};;);
for(var a = function(x = b in c) {};;);
for(var a in b in c);
for(var a in 1 || b in c);
for(var a in 1 + (2 || b in c));
for(var a in ()=>b in c);
for(var a in 1 || (()=>b in c));
for(var a in ()=>{
    b in c;
});
for(var a in [
    b in c
]);
for(var a in {
    b: b in c
});
for(var a in (x = b in c)=>{});
for(var a in class extends (b in c) {
});
for(var a in function(x = b in c) {});
for(; a = b in c;);
for(; a = 1 || b in c;);
for(; a = 1 + (2 || b in c););
for(; a = ()=>b in c;);
for(; a = 1 || (()=>b in c););
for(; a = ()=>{
    b in c;
};);
for(; a = [
    b in c
];);
for(; a = {
    b: b in c
};);
for(; a = (x = b in c)=>{};);
for(; a = class extends (b in c) {
};);
for(; a = function(x = b in c) {};);
