async function outer() {
    namespace N {
        await(0);
        const object = await {};
        const binary = await + 1;
        namespace Inner { await(value); }
        function ordinary() {
            const await = 1;
            return await + 1;
        }
    }
    await value;
}
namespace After {
    const await = 1;
    const binary = await + 1;
}
const await = 1;
