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
test("windows-process-tree", async ()=>{
    return new Promise((resolve, reject)=>{
        getProcessTree(123, (tree)=>{
            if (tree) {
                resolve();
            } else {
                reject(new Error("windows-process-tree"));
            }
        });
    });
});
async function copyExtensions(fromExtensions) {
    const extensions = await Promise.all(fromExtensions.filter((e)=>!e.isApplicationScoped).map(async (e)=>[
            e,
            await scanMetadata(e)
        ]));
}
export { };
