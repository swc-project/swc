//// [asyncGeneratorParameterEvaluation.ts]
class Sub extends Super {
    async *m(x, y = z, { ...w }) {
        super.foo();
    }
}
