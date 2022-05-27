const c = "PASS";
var a = ()=>{
    if (c) return c;
};
{
    let b = a();
    console.log(b);
}
