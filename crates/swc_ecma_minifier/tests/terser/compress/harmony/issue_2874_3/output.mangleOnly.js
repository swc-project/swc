function a() {
    return b + c;
}
let b, c;
let d = (d)=>{
    b = "A";
    c = d;
    console.log(a());
};
d(1);
d(2);
