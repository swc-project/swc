function b() {
    return c + d;
}
let c, d;
let a = (a)=>{
    c = "A";
    d = a;
    console.log(b());
};
a(1);
a(2);
