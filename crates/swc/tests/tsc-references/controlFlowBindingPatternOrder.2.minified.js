//// [controlFlowBindingPatternOrder.ts]
// https://github.com/microsoft/TypeScript/pull/41094#issuecomment-716044363
{
    let a = 0, [{ [a = 1]: b } = [
        9,
        a
    ]] = [];
}{
    let a = 1, [{ [a]: b } = [
        9,
        a = 0
    ]] = [];
}{
    let a = 1, [{ [a]: b } = [
        9,
        a = 0,
        5
    ]] = [];
}{
    let a = 0, [{ [a = 1]: b } = [
        9,
        a
    ]] = [
        [
            9,
            8
        ]
    ];
}{
    let a = 1, [{ [a]: b } = [
        a = 0,
        9
    ]] = [
        [
            8,
            9
        ]
    ];
}
