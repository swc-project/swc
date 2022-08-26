const e = ()=>{};
function t() {
    let t = e();
    let c = 0;
    switch((c = 123)){
        case "never-reached":
            const n = e();
            e(n);
    }
    return t === 123 ? "FAIL" : "PASS";
}
console.log(t());
