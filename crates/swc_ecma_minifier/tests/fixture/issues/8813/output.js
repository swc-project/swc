(()=>{
    const x = 'asdf';
    let y = "PASS 1";
    switch(x){
        case x:
        default:
        case y = "FAIL":
    }
    console.log(y);
})(), (()=>{
    const x = 'asdf';
    let y = "PASS 2";
    switch(x){
        case x:
        case y = "FAIL":
    }
    console.log(y);
})(), console.log("PASS 3"), console.log("PASS 4"), (()=>{
    let y = "FAIL", z = "FAIL";
    switch('asdf'){
        case y = "PASS 5":
        case z = "PASS 5":
    }
    console.log(y, z);
})();
var a, c = "FAIL";
a = 0 / 0, function() {
    switch(a){
        case a:
            break;
        case void (c = "PASS"):
            c = "FAIL";
    }
}(), console.log(c);
