//// [controlFlowAssignmentPatternOrder.ts]
// https://github.com/microsoft/TypeScript/pull/41094#issuecomment-716044363
{
    let a = 0;
    let b;
    [{ [a = 1]: b  } = [
        9,
        a
    ]] = [];
    const bb = b;
}{
    let a = 1;
    let b;
    [{ [a]: b  } = [
        9,
        a = 0
    ]] = [];
    const bb = b;
}{
    let a = 0;
    let b;
    [{ [a = 1]: b  } = [
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
    let b;
    [{ [a]: b  } = [
        a = 0,
        9
    ]] = [
        [
            8,
            9
        ]
    ];
    const bb = b;
}// same as above but on left of a binary expression
{
    let a = 0;
    let b;
    [{ [a = 1]: b  } = [
        9,
        a
    ]] = [], f();
    const bb = b;
}{
    let a = 1;
    let b;
    [{ [a]: b  } = [
        9,
        a = 0
    ]] = [], f();
    const bb = b;
}{
    let a = 0;
    let b;
    [{ [a = 1]: b  } = [
        9,
        a
    ]] = [
        [
            9,
            8
        ]
    ], f();
    const bb = b;
}{
    let a = 1;
    let b;
    [{ [a]: b  } = [
        a = 0,
        9
    ]] = [
        [
            8,
            9
        ]
    ], f();
    const bb = b;
}// same as above but on right of a binary expression
{
    let a = 0;
    let b;
    f(), [{ [a = 1]: b  } = [
        9,
        a
    ]] = [];
    const bb = b;
}{
    let a = 1;
    let b;
    f(), [{ [a]: b  } = [
        9,
        a = 0
    ]] = [];
    const bb = b;
}{
    let a = 0;
    let b;
    f(), [{ [a = 1]: b  } = [
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
    let b;
    f(), [{ [a]: b  } = [
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
