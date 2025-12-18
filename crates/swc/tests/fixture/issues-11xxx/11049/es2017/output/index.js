class MyClass {
    constructor(data){
        if (!(data instanceof Array)) throw new Error('Invalid instance');
        this.data = data;
    }
}
function fetchPromise(idx) {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>resolve(idx), 10);
    });
}
async function func1() {
    const arr = [
        1,
        [
            2,
            3
        ],
        ,
        4
    ];
    let [a, [, b], , d] = arr;
    const instance = new MyClass([
        a,
        b,
        d
    ]);
    a = await fetchPromise(instance.data[0]) || fetchPromise(0);
    b = await fetchPromise(instance.data[1]) || fetchPromise(0);
    d = await fetchPromise(instance.data[2]) || fetchPromise(0);
    return [
        a,
        b,
        d
    ];
}
function main() {
    const res = func1();
    res.then((value)=>console.log(value));
}
main();
