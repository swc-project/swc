//// [asyncGeneratorParameterEvaluation.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
// https://github.com/microsoft/TypeScript/issues/40410
async function* f1(x, y = z) {}
async function* f2({ [z]: x }) {}
class Sub extends Super {
    async *m(x, _1 = void 0, _2) {
        let _ref = [
            _1,
            _2
        ], [y = z, _ref1] = _ref, {} = _ref1, w = _extends({}, _ref1);
        super.foo();
    }
}
