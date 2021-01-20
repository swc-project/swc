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
class A {
    s = d();
    a() {
        this.s.resolve();
    }
    b() {
        this.s = d1();
    }
}
new A();
