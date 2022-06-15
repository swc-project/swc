const a = "PASS";
var b = ()=>{
    if (a) return a;
};
{
    let c = b();
    console.log(c);
}
