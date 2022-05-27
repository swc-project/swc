const b = ()=>{};
function a() {
    let a = b();
    let c = 0;
    switch((c = 123)){
        case "never-reached":
            const d = b();
            b(d);
    }
    return a === 123 ? "FAIL" : "PASS";
}
console.log(a());
