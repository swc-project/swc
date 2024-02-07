//// [contextuallyTypeAsyncFunctionReturnType.ts]
test("windows-process-tree", async ()=>new Promise((resolve, reject)=>{
        getProcessTree(123, (tree)=>{
            tree ? resolve() : reject(Error("windows-process-tree"));
        });
    }));
export { };
