function e() {
    return l + n;
}
let l, n;
let o = (o) => {
    l = "A";
    n = o;
    console.log(e());
};
o(1);
o(2);
