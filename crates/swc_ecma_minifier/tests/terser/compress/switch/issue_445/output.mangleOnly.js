const e = ()=>{};
function c() {
    let c = e();
    let n = 0;
    switch((n = 123)){
        case "never-reached":
            const t = e();
            e(t);
    }
    return c === 123 ? "FAIL" : "PASS";
}
console.log(c());
