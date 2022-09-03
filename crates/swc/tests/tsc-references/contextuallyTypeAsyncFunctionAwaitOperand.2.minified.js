//// [contextuallyTypeAsyncFunctionAwaitOperand.ts]
async function fn1() {
    return await {
        key: "value"
    }, await new Promise((resolve)=>resolve({
            key: "value"
        })), await {
        key: "value"
    };
}
