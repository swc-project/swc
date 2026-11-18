enum E {
    A,
    B,
    C,
    D = ((C) => {
        console.log(A, B, C, F);
        return 2;
    })(),
    F = "F",
}
