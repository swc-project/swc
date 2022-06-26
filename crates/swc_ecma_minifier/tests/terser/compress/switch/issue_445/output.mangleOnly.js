const a = ()=>{};
function b() {
    let b = a();
    let c = 0;
    switch((c = 123)){
        case "never-reached":
            const d = a();
            a(d);
    }
    return b === 123 ? "FAIL" : "PASS";
}
console.log(b());
