function d() {
    let methods;
    const promise = new Promise((resolve, reject)=>{
        methods = {
            resolve,
            reject
        };
    });
    return Object.assign(promise, methods);
}
const d1 = d;
const d2 = d1;
class A {
    s = d2();
    a() {
        this.s.resolve();
    }
}
new A();
