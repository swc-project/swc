export {};
declare module "assignment" {
    export = await value;
    const identifier = await;
    const binary = await + 1;
}
declare module "default" {
    export default await value;
    const identifier = await;
    const binary = await + 1;
}
async function outer() {
    namespace N {
        export = await + 1;
        const binary = await + 1;
    }
    await value;
}
