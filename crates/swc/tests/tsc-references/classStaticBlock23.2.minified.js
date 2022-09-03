//// [classStaticBlock23.ts]
const nums = [
    1,
    2,
    3
].map((n)=>Promise.resolve(n));
class C {
    static{
        for await (let nn of nums)console.log(nn);
    }
}
async function foo() {}
