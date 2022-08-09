const t = ()=>{};
function c() {
    let c = t();
    let n = 0;
    switch((n = 123)){
        case "never-reached":
            const e = t();
            t(e);
    }
    return c === 123 ? "FAIL" : "PASS";
}
console.log(c());
