function e() {
    return l + n;
}
let l, n;
let o = (l)=>{
    l = "A";
    n = l;
    console.log(e());
};
o(1);
o(2);
