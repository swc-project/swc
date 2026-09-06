function* generator() {
    return function(yield) {
        return ++yield;
    };
}
async function asynchronous() {
    return function(await) {
        return ++await;
    };
}
const asyncArrow = async ()=>function(await) {
        return ++await;
    };
console.log(generator().next().value(0)), asynchronous().then((fn)=>{
    console.log(fn(0));
}), asyncArrow().then((fn)=>{
    console.log(fn(0));
});
