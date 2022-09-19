//// [controlFlowGenericTypes.ts]
export function bounceAndTakeIfA(value) {
    return "A" === value && takeA(value), value;
}
