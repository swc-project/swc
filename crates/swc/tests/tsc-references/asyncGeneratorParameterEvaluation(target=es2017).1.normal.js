//// [asyncGeneratorParameterEvaluation.ts]
// https://github.com/microsoft/TypeScript/issues/40410
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
async function* f1(x, y = z) {}
async function* f2({ [z]: x }) {}
class Sub extends Super {
    async *m(x, y = z, _param) {
        var w = _extends({}, _object_destructuring_empty(_param));
        super.foo();
    }
}
