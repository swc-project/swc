{
    let a = 0;
    let b;
    [{ [a = 1]: b  } = [
        9,
        a
    ]] = [];
    const bb = b;
}{
    let a1 = 1;
    let b1;
    [{ [a1]: b1  } = [
        9,
        a1 = 0
    ]] = [];
    const bb1 = b1;
}{
    let a2 = 0;
    let b2;
    [{ [a2 = 1]: b2  } = [
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
    let b3;
    [{ [a3]: b3  } = [
        a3 = 0,
        9
    ]] = [
        [
            8,
            9
        ]
    ];
    const bb3 = b3;
}// same as above but on left of a binary expression
{
    let a4 = 0;
    let b4;
    [{ [a4 = 1]: b4  } = [
        9,
        a4
    ]] = [], f();
    const bb4 = b4;
}{
    let a5 = 1;
    let b5;
    [{ [a5]: b5  } = [
        9,
        a5 = 0
    ]] = [], f();
    const bb5 = b5;
}{
    let a6 = 0;
    let b6;
    [{ [a6 = 1]: b6  } = [
        9,
        a6
    ]] = [
        [
            9,
            8
        ]
    ], f();
    const bb6 = b6;
}{
    let a7 = 1;
    let b7;
    [{ [a7]: b7  } = [
        a7 = 0,
        9
    ]] = [
        [
            8,
            9
        ]
    ], f();
    const bb7 = b7;
}// same as above but on right of a binary expression
{
    let a8 = 0;
    let b8;
    f(), [{ [a8 = 1]: b8  } = [
        9,
        a8
    ]] = [];
    const bb8 = b8;
}{
    let a9 = 1;
    let b9;
    f(), [{ [a9]: b9  } = [
        9,
        a9 = 0
    ]] = [];
    const bb9 = b9;
}{
    let a10 = 0;
    let b10;
    f(), [{ [a10 = 1]: b10  } = [
        9,
        a10
    ]] = [
        [
            9,
            8
        ]
    ];
    const bb10 = b10;
}{
    let a11 = 1;
    let b11;
    f(), [{ [a11]: b11  } = [
        a11 = 0,
        9
    ]] = [
        [
            8,
            9
        ]
    ];
    const bb11 = b11;
}
