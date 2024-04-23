//// [conditionalTypesExcessProperties.ts]
function testFunc2(a, sa) {
    sa = {
        test: 'hi',
        arg: a
    }; // not excess (but currently still not assignable)
    sa = {
        test: 'bye',
        arg: a,
        arr: a
    } // excess
    ;
}
