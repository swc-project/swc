//// [controlFlowGenericTypes.ts]
import "@swc/helpers/_/_class_call_check";
export function bounceAndTakeIfA(value) {
    return 'A' === value && takeA(value), value;
}
