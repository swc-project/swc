//// [asyncGeneratorParameterEvaluation.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
// https://github.com/microsoft/TypeScript/issues/40410
async function* f1(x, y = z) {}
async function* f2({ [z]: x }) {}
class Sub extends Super {
    async *m(x, y = z, _param) {
        var {} = _param, w = _extends({}, _param);
        super.foo();
    }
}
