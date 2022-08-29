//// [generatorReturnContextualType.ts]
// #35995
function* f1() {
    return {
        x: 'x'
    };
}
function* g1() {
    return {
        x: 'x'
    };
}
async function* f2() {
    return {
        x: 'x'
    };
}
async function* g2() {
    return {
        x: 'x'
    };
}
async function* f3() {
    return Promise.resolve({
        x: 'x'
    });
}
async function* g3() {
    return Promise.resolve({
        x: 'x'
    });
}
async function* f4() {
    const ret = {
        x: 'x'
    };
    return Promise.resolve(ret); // Error
}
async function* g4() {
    const ret = {
        x: 'x'
    };
    return Promise.resolve(ret); // Error
}
