//// [controlFlowBindingPatternOrder.ts]
// https://github.com/microsoft/TypeScript/pull/41094#issuecomment-716044363
{
    let a = 0;
    const [{ [a = 1]: b  } = [
        9,
        a
    ]] = [];
    const bb = b;
}{
    let a1 = 1;
    const [{ [a1]: b1  } = [
        9,
        a1 = 0
    ]] = [];
    const bb1 = b1;
}{
    let a2 = 1;
    const [{ [a2]: b2  } = [
        9,
        a2 = 0,
        5
    ]] = [];
    const bb2 = b2;
}{
    let a3 = 0;
    const [{ [a3 = 1]: b3  } = [
        9,
        a3
    ]] = [
        [
            9,
            8
        ]
    ];
    const bb3 = b3;
}{
    let a4 = 1;
    const [{ [a4]: b4  } = [
        a4 = 0,
        9
    ]] = [
        [
            8,
            9
        ]
    ];
    const bb4 = b4;
}
