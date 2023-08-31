//// [asyncGeneratorGenericNonWrappedReturn.ts]
// #48966
export async function* test(a) {
    return a // `T` should be allowed here even though the generator's `returnType` is `Awaited<T>`
    ;
}
