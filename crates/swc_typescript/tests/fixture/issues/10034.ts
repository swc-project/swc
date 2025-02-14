const A_SYMBOL = Symbol("A_SYMBOL");
const func = () => null;

export class SomeClass {
    private func(
        queryFingerprint: string,
        onStale: () => void
    ): null | typeof A_SYMBOL {
        return null;
    }

    private func2(
        queryFingerprint: string,
        onStale: () => void
    ): null | typeof func {
        return null;
    }
}
