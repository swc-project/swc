//// [controlFlowBindingPatternOrder.ts]
{
    let a = 0, [{ [a = 1]: b  } = [
        9,
        a
    ]] = [];
}{
    let a1 = 1, [{ [a1]: b1  } = [
        9,
        a1 = 0
    ]] = [];
}{
    let a2 = 1, [{ [a2]: b2  } = [
        9,
        a2 = 0,
        5
    ]] = [];
}{
    let a3 = 0, [{ [a3 = 1]: b3  } = [
        9,
        a3
    ]] = [
        [
            9,
            8
        ]
    ];
}{
    let a4 = 1, [{ [a4]: b4  } = [
        a4 = 0,
        9
    ]] = [
        [
            8,
            9
        ]
    ];
}
