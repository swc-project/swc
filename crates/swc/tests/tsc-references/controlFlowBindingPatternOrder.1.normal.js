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
    let a = 1;
    const [{ [a]: b  } = [
        9,
        a = 0
    ]] = [];
    const bb = b;
}{
    let a = 1;
    const [{ [a]: b  } = [
        9,
        a = 0,
        5
    ]] = [];
    const bb = b;
}{
    let a = 0;
    const [{ [a = 1]: b  } = [
        9,
        a
    ]] = [
        [
            9,
            8
        ]
    ];
    const bb = b;
}{
    let a = 1;
    const [{ [a]: b  } = [
        a = 0,
        9
    ]] = [
        [
            8,
            9
        ]
    ];
    const bb = b;
}
