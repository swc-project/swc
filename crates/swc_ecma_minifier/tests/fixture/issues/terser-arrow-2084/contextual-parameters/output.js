function* generator() {
    return function(yield1) {
        return ++yield1;
    };
}
async function asynchronous() {
    return function(await1) {
        return ++await1;
    };
}
function* generatorDefault() {
    return function(value = yield) {
        return value;
    };
}
async function asynchronousDefault() {
    return function(value = await) {
        return value;
    };
}
const asyncArrow = async ()=>function(await1) {
        return ++await1;
    };
function* generatorArrowBody() {
    return ()=>(yield1)=>++yield1;
}
async function asyncArrowBody() {
    return ()=>(await1)=>++await1;
}
console.log(generator().next().value(0)), asynchronous().then((fn)=>{
    console.log(fn(0));
}), asyncArrow().then((fn)=>{
    console.log(fn(0));
}), console.log(generatorArrowBody().next().value()(0)), asyncArrowBody().then((fn)=>{
    console.log(fn()(0));
});
