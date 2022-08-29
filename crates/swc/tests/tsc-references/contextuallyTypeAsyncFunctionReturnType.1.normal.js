//// [contextuallyTypeAsyncFunctionReturnType.ts]
async function fn1() {
    return {
        key: "value"
    };
}
async function fn2() {
    return new Promise((resolve)=>{
        resolve({
            key: "value"
        });
    });
}
async function fn3() {
    return await {
        key: "value"
    };
}
async function fn4() {
    return await new Promise((resolve)=>{
        resolve({
            key: "value"
        });
    });
}
