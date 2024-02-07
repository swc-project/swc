//// [asyncGeneratorParameterEvaluation.ts]
// https://github.com/microsoft/TypeScript/issues/40410
async function* f1(x, y = z) {}
async function* f2({ [z]: x }) {}
class Sub extends Super {
    async *m(x, y = z, { ...w }) {
        super.foo();
    }
}
