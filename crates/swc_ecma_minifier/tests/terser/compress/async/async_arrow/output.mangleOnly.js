let a = async (a)=>await foo(a);
let b = async ()=>await bar();
let c = async (a)=>await baz(a);
let d = async (a, b)=>{
    await far(a, b);
};
let e = async ({ x: a = [
    1
] , y: b = 2  })=>{
    await wow(a, b);
};
