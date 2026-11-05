
export default async function (x) {
    async function bar(y) {
        (async (z) => x(y)(z))();
    }
}
