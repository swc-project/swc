//// [controlFlowAssignmentPatternOrder.ts]
// https://github.com/microsoft/TypeScript/pull/41094#issuecomment-716044363
{
    let b, a = 0;
    [{ 1: b } = [
        9,
        a
    ]] = [];
}{
    let b, a = 1;
    [{ [a]: b } = [
        9,
        0
    ]] = [];
}{
    let b, a = 0;
    [{ 1: b } = [
        9,
        a
    ]] = [
        [
            9,
            8
        ]
    ];
}{
    let b, a = 1;
    [{ [a]: b } = [
        0,
        9
    ]] = [
        [
            8,
            9
        ]
    ];
}// same as above but on left of a binary expression
{
    let b, a = 0;
    [{ 1: b } = [
        9,
        a
    ]] = [], f();
}{
    let b, a = 1;
    [{ [a]: b } = [
        9,
        0
    ]] = [], f();
}{
    let b, a = 0;
    [{ 1: b } = [
        9,
        a
    ]] = [
        [
            9,
            8
        ]
    ], f();
}{
    let b, a = 1;
    [{ [a]: b } = [
        0,
        9
    ]] = [
        [
            8,
            9
        ]
    ], f();
}// same as above but on right of a binary expression
{
    let b, a = 0;
    f(), [{ 1: b } = [
        9,
        a
    ]] = [];
}{
    let b, a = 1;
    f(), [{ [a]: b } = [
        9,
        0
    ]] = [];
}{
    let b, a = 0;
    f(), [{ 1: b } = [
        9,
        a
    ]] = [
        [
            9,
            8
        ]
    ];
}{
    let b, a = 1;
    f(), [{ [a]: b } = [
        0,
        9
    ]] = [
        [
            8,
            9
        ]
    ];
}
