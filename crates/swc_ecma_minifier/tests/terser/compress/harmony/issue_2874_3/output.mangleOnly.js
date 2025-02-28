function l() {
    return n + o;
}
let n, o;
let e = (e)=>{
    n = "A";
    o = e;
    console.log(l());
};
e(1);
e(2);
