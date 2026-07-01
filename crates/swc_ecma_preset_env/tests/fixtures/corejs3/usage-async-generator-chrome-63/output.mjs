import "core-js/modules/es.promise.js";
export default async function*() {
    yield 1;
}
export async function plain() {
    await 2;
}
