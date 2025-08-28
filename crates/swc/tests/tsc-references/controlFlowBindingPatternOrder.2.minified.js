//// [controlFlowBindingPatternOrder.ts]
{
    let a = 0;
    const [{ [a = 1]: b } = [
        9,
        a
    ]] = [];
}{
    let a = 1;
    const [{ [a]: b } = [
        9,
        a = 0
    ]] = [];
}{
    let a = 1;
    const [{ [a]: b } = [
        9,
        a = 0,
        5
    ]] = [];
}{
    let a = 0;
    const [{ [a = 1]: b } = [
        9,
        a
    ]] = [
        [
            9,
            8
        ]
    ];
}{
    let a = 1;
    const [{ [a]: b } = [
        a = 0,
        9
    ]] = [
        [
            8,
            9
        ]
    ];
}
