const c = ()=>{};
function e() {
    let e = c();
    let n = 0;
    switch((n = 123)){
        case "never-reached":
            const t = c();
            c(t);
    }
    return e === 123 ? "FAIL" : "PASS";
}
console.log(e());
