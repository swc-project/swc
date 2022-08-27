//// [contextuallyTypeAsyncFunctionAwaitOperand.ts]
async function fn1() {
    const obj1 = await {
        key: "value"
    };
    const obj2 = await new Promise((resolve)=>resolve({
            key: "value"
        }));
    return await {
        key: "value"
    };
}
