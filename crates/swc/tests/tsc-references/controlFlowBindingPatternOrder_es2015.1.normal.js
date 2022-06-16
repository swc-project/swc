// @target: esnext
// @noEmit: true
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
    let a2 = 0;
    const [{ [a2 = 1]: b2  } = [
        9,
        a2
    ]] = [
        [
            9,
            8
        ]
    ];
    const bb2 = b2;
}{
    let a3 = 1;
    const [{ [a3]: b3  } = [
        a3 = 0,
        9
    ]] = [
        [
            8,
            9
        ]
    ];
    const bb3 = b3;
}
