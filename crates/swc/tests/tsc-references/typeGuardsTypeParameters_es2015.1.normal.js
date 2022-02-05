// @strictNullChecks: true
// Type guards involving type parameters produce intersection types
class C {
}
function f1(x) {
    if (x instanceof C) {
        let v1 = x;
        let v2 = x;
        x.prop;
    }
}
function f2(x) {
    if (typeof x === "string") {
        let v1 = x;
        let v2 = x;
        x.length;
    }
}
// Repro from #13872
function fun(item) {
    const strings = [];
    for(const key in item){
        const value = item[key];
        if (typeof value === "string") {
            strings.push(value);
        }
    }
}
