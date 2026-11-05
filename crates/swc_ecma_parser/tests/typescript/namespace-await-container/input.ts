export {};
namespace N {
    const await = 1;
    const next = await + 1;
    const escaped = a\u0077ait;
    function f(await: number) { return await; }
    function* g() { yield await; }
    async function h() { return await next; }
    namespace Inner { const await = 2; }
}
await Promise.resolve();
